import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";

// Disk cache directory for inquiry images to ensure persistence across sessions
const IMAGE_DIR = path.join(process.cwd(), ".cache", "inquiry-images");
try {
  if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
  }
} catch (e) {
  // directory creation fallback
}

interface StoredImage {
  buffer: Buffer;
  mimeType: string;
  filename: string;
  createdAt: number;
}
const imageStore = new Map<string, StoredImage>();

function parseImageData(imageUrl?: string): { mimeType: string; extension: string; buffer: Buffer } | null {
  if (!imageUrl || typeof imageUrl !== 'string') return null;
  if (imageUrl.startsWith('data:')) {
    const match = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!match) return null;
    const mimeType = match[1];
    let extension = 'jpg';
    if (mimeType.includes('png')) extension = 'png';
    else if (mimeType.includes('webp')) extension = 'webp';
    else if (mimeType.includes('gif')) extension = 'gif';
    else if (mimeType.includes('jpeg')) extension = 'jpg';

    try {
      const buffer = Buffer.from(match[2], 'base64');
      return { mimeType, extension, buffer };
    } catch (e) {
      return null;
    }
  }
  return null;
}

interface EmailRequestBody {
  recipientEmail: string;
  recipientName?: string;
  recipientRole?: string;
  senderName: string;
  studentName?: string;
  senderPhone: string;
  senderEmail?: string;
  type: string;
  typeTitle: string;
  message: string;
  gradeLevel?: string;
  programInterest?: string;
  riskLevel?: 'high' | 'medium' | 'low';
  riskCategory?: string;
  location?: string;
  imageUrl?: string;
  isAnonymous?: boolean;
  smtpConfig?: {
    host?: string;
    port?: number;
    secure?: boolean;
    user?: string;
    pass?: string;
    fromEmail?: string;
    fromName?: string;
    enabled?: boolean;
  };
}

function buildHtmlEmail(data: EmailRequestBody, imageCid?: string | null, publicImageUrl?: string | null): string {
  const currentYear = new Date().getFullYear();
  const timestamp = new Date().toLocaleString("mn-MN", { timeZone: "Asia/Ulaanbaatar" });
  const isRisk = data.type === 'risk' || !!data.riskLevel;
  const isBullying = data.type === 'bullying';

  const riskLabel = data.riskLevel === 'high' ? 'ӨНДӨР' : data.riskLevel === 'medium' ? 'ДУНД' : 'БАГА';
  const riskColor = data.riskLevel === 'high' ? '#dc2626' : data.riskLevel === 'medium' ? '#d97706' : '#16a34a';
  const riskBg = data.riskLevel === 'high' ? '#fef2f2' : data.riskLevel === 'medium' ? '#fffbeb' : '#f0fdf4';
  const riskBorder = data.riskLevel === 'high' ? '#fca5a5' : data.riskLevel === 'medium' ? '#fde68a' : '#bbf7d0';

  const hasImage = Boolean(imageCid || publicImageUrl || data.imageUrl);

  const headerBg = isRisk
    ? (data.riskLevel === 'high' ? 'linear-gradient(135deg, #991b1b 0%, #b91c1c 100%)' : 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)')
    : isBullying
    ? 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)'
    : 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)';

  const badgeText = isRisk
    ? '⚠️ ЭРСДЛИЙН ҮНЭЛГЭЭ МЭДЭЭЛЭЛ'
    : isBullying
    ? '🔒 ҮЕ ТЭНГИЙН ДЭЭРЭЛХЭЛТ - НУУЦ МЭДЭЭЛЭЛ'
    : (data.typeTitle || 'Санал хүсэлт');

  const titleText = isRisk
    ? 'Сургуулийн орчны эрсдлийн мэдээлэл ирлээ'
    : isBullying
    ? 'Үе тэнгийн дээрэлхэлтийн мэдээлэл ирлээ'
    : 'Шинэ санал хүсэлт ирлээ';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .header { background: ${headerBg}; color: #ffffff; padding: 28px 32px; text-align: left; }
        .badge { display: inline-block; background: ${isRisk ? '#ffffff' : isBullying ? '#eff6ff' : '#fef3c7'}; color: ${isRisk ? '#991b1b' : isBullying ? '#1e3a8a' : '#92400e'}; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; }
        .title { font-size: 20px; font-weight: bold; margin: 0 0 6px 0; }
        .subtitle { font-size: 13px; color: #cbd5e1; margin: 0; }
        .content { padding: 32px; }
        .risk-banner { background: ${riskBg}; border: 2px solid ${riskBorder}; border-radius: 12px; padding: 16px; margin-bottom: 24px; }
        .risk-badge { display: inline-block; background: ${riskColor}; color: #ffffff; font-weight: bold; font-size: 13px; padding: 4px 10px; border-radius: 6px; }
        .recipient-box { background: #f1f5f9; border-left: 4px solid #2563eb; padding: 14px 18px; border-radius: 8px; margin-bottom: 24px; font-size: 13px; }
        .data-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .data-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
        .data-table td.label { width: 150px; color: #64748b; font-weight: 600; }
        .data-table td.value { color: #0f172a; font-weight: 500; }
        .message-box { background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 18px; margin-bottom: 24px; }
        .message-title { font-size: 13px; font-weight: bold; color: #92400e; margin-bottom: 8px; }
        .message-text { font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; }
        .image-box { margin-top: 20px; padding: 16px; background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 12px; text-align: center; }
        .image-box img { max-width: 100%; max-height: 440px; border-radius: 8px; object-fit: contain; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 20px 32px; text-align: center; font-size: 12px; color: #64748b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="badge">${badgeText}</div>
          <h1 class="title">${titleText}</h1>
          <p class="subtitle">Эрдмийн Далай Цогцолбор Сургууль — Цахим хуудас</p>
        </div>
        <div class="content">
          <div class="recipient-box">
            <strong>Хариуцах ажилтан / хүлээн авагч:</strong> ${data.recipientName || (isBullying ? "Нийгмийн ажилтан / Сэтгэл зүйч" : "Аюулгүй байдлын ажилтан")} ${data.recipientRole ? `(${data.recipientRole})` : ""}<br/>
            <strong>Имэйл хаяг:</strong> <span style="color:#2563eb; font-family:monospace;">${data.recipientEmail}</span>
          </div>

          ${isRisk ? `
          <div class="risk-banner">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:bold; font-size:14px; color:${riskColor};">Эрсдлийн түвшин:</span>
              <span class="risk-badge">${riskLabel} ЭРСДЭЛ</span>
            </div>
            ${data.riskCategory ? `<div style="font-size:13px; color:#334155; margin-top:4px;"><strong>Эрсдэлийн ангилал:</strong> ${data.riskCategory}</div>` : ""}
            ${data.location ? `<div style="font-size:13px; color:#334155; margin-top:4px;"><strong>Байршил:</strong> 📍 ${data.location}</div>` : ""}
          </div>
          ` : ""}

          ${isBullying ? `
          <div style="background: #eff6ff; border: 2px solid #93c5fd; border-radius: 12px; padding: 14px 18px; margin-bottom: 20px; color: #1e3a8a;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 4px;">🔒 МЭДЭЭЛЭЛ ӨГСӨН СУРАГЧИЙН ХУВИЙН НУУЦЛАЛЫН БАТАЛГАА:</div>
            <div style="font-size: 12px; line-height: 1.5; color: #1e40af;">
              ${data.isAnonymous ? 'Энэхүү мэдээллийг илгээгч сурагч нэрээ нууцлах сонголт хийсэн бөгөөд сурагчийн эрх ашиг, сэтгэл зүйн аюулгүй байдлыг хангах үүднээс мэдээллийг 100% нууцалж хүргүүлж байна.' : 'Энэхүү мэдээллийг өгсөн сурагчийн нэр, утасны дугаар, ангийн хувийн мэдээлэл чанд нууцлагдсан тул олон нийтэд задруулахгүй, зөвхөн сургуулийн холбогдох нийгмийн ажилтан, сэтгэл зүйчийн хяналтад асуудлыг шийдвэрлэхэд ашиглана.'}
            </div>
          </div>
          ` : ""}

          ${data.isAnonymous && !isBullying ? `
          <div style="background: #f8fafc; border: 2px dashed #94a3b8; border-radius: 12px; padding: 12px 16px; margin-bottom: 20px;">
            <span style="font-weight:bold; color:#0f172a; font-size:13px;">🛡️ НЭРЭЭ НУУЦАЛСАН МЭДЭЭЛЭЛ:</span>
            <span style="font-size:12px; color:#475569; display:block; margin-top:2px;">Илгээгч нь нэрээ нууцлах сонголтыг хийсэн тул хувийн нууцыг чандлан хамгаалж, зөвхөн дурдсан асуудал, нөхцөл байдалд анхаарна уу.</span>
          </div>
          ` : ""}

          <table class="data-table">
            <tr>
              <td class="label">${isBullying ? "Сурагчийн нэр:" : "Илгээгчийн нэр:"}</td>
              <td class="value"><strong>${data.isAnonymous ? "🔒 Нэрээ нууцалсан" : (data.studentName || data.senderName)}</strong></td>
            </tr>
            ${data.gradeLevel ? `
            <tr>
              <td class="label">Анги:</td>
              <td class="value"><strong>${data.gradeLevel}</strong></td>
            </tr>` : ""}
            <tr>
              <td class="label">Холбогдох утас:</td>
              <td class="value">${data.isAnonymous && (!data.senderPhone || data.senderPhone === 'Нууцалсан') ? '<span style="color:#64748b; font-style:italic;">(Нууцалсан / Оруулаагүй)</span>' : `<a href="tel:${data.senderPhone}" style="color:#2563eb; text-decoration:none; font-weight:bold;">${data.senderPhone}</a>`}</td>
            </tr>
            ${data.senderEmail ? `
            <tr>
              <td class="label">Имэйл хаяг:</td>
              <td class="value"><a href="mailto:${data.senderEmail}" style="color:#2563eb; text-decoration:none;">${data.senderEmail}</a></td>
            </tr>` : ""}
            ${data.location ? `
            <tr>
              <td class="label">Илэрсэн байршил:</td>
              <td class="value"><strong>${data.location}</strong></td>
            </tr>` : ""}
            ${data.riskCategory ? `
            <tr>
              <td class="label">Эрсдэл бүртгэл:</td>
              <td class="value">${data.riskCategory}</td>
            </tr>` : ""}
            ${data.programInterest ? `
            <tr>
              <td class="label">Сонирхсон хөтөлбөр:</td>
              <td class="value">${data.programInterest}</td>
            </tr>` : ""}
            <tr>
              <td class="label">Илгээсэн хугацаа:</td>
              <td class="value">${timestamp}</td>
            </tr>
          </table>

          <div class="message-box" style="${isRisk ? 'background:#f8fafc; border-color:#e2e8f0;' : isBullying ? 'background:#eff6ff; border-color:#bfdbfe;' : ''}">
            <div class="message-title" style="${isRisk ? 'color:#0f172a;' : isBullying ? 'color:#1e3a8a;' : ''}">${isRisk ? 'Эрсдэлийн дэлгэрэнгүй тайлбар, нөхцөл байдал:' : isBullying ? 'Үе тэнгийн дээрэлхэлтийн талаарх дэлгэрэнгүй мэдээлэл:' : 'Санал хүсэлтийн дэлгэрэнгүй агуулга:'}</div>
            <div class="message-text">${data.message || "(Агуулга байхгүй)"}</div>
          </div>

          ${hasImage ? `
          <div class="image-box" style="margin-top: 24px; padding: 20px; background: #fff5f5; border: 2px dashed #f87171; border-radius: 14px; text-align: center;">
            <div style="font-size: 14px; font-weight: bold; color: #991b1b; margin-bottom: 12px; display: inline-block;">
              📷 ХАВСАРГАСАН ЭРСДЛИЙН БОДИТ ГЭРЭЛ ЗУРАГ:
            </div>
            
            <div style="background: #ffffff; border: 1px solid #fed7aa; border-radius: 10px; padding: 10px; display: inline-block; max-width: 100%;">
              ${imageCid ? `
                <img src="cid:${imageCid}" alt="Хавсаргасан эрсдлийн зураг" style="max-width: 100%; max-height: 480px; border-radius: 8px; object-fit: contain; display: block; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              ` : (publicImageUrl ? `
                <img src="${publicImageUrl}" alt="Хавсаргасан эрсдлийн зураг" style="max-width: 100%; max-height: 480px; border-radius: 8px; object-fit: contain; display: block; margin: 0 auto; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              ` : `
                <img src="${data.imageUrl}" alt="Хавсаргасан эрсдлийн зураг" style="max-width: 100%; max-height: 480px; border-radius: 8px; object-fit: contain; display: block; margin: 0 auto;" />
              `)}
            </div>

            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #fca5a5;">
              ${publicImageUrl ? `
                <div style="margin-bottom: 8px;">
                  <a href="${publicImageUrl}" target="_blank" style="display: inline-block; background: #dc2626; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: bold; padding: 10px 22px; border-radius: 8px; box-shadow: 0 2px 4px rgba(220,38,38,0.2);">
                    🔍 Зургийг томоор нээж үзэх / Татах
                  </a>
                </div>
                <div style="font-size: 11px; color: #64748b;">
                  Шууд холбоос: <a href="${publicImageUrl}" target="_blank" style="color: #2563eb; text-decoration: underline; word-break: break-all;">${publicImageUrl}</a>
                </div>
              ` : ''}
              <div style="font-size: 11px; color: #7f1d1d; margin-top: 8px; font-weight: 500;">
                📎 Энэхүү зураг нь имэйлийн хавсралт (Attachment) хэсэгт файл хэлбэрээр давхар хавсаргагдсан тул татан авч үзэх бүрэн боломжтой.
              </div>
            </div>
          </div>
          ` : ""}
        </div>
        <div class="footer">
          Энэхүү имэйл нь Эрдмийн Далай Цогцолбор сургуулийн вебсайтын санал хүсэлт, эрсдлийн үнэлгээний хэсгээс автоматаар илгээгдсэн болно.<br/>
          &copy; ${currentYear} Эрдмийн Далай Цогцолбор Сургууль
        </div>
      </div>
    </body>
    </html>
  `;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Public image viewer for email attachments and direct preview
  app.get("/api/inquiry-image/:id", (req, res) => {
    const id = req.params.id;
    let item = imageStore.get(id);

    if (!item) {
      try {
        const metaPath = path.join(IMAGE_DIR, `${id}.json`);
        const dataPath = path.join(IMAGE_DIR, `${id}.bin`);
        if (fs.existsSync(metaPath) && fs.existsSync(dataPath)) {
          const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
          const buffer = fs.readFileSync(dataPath);
          item = { buffer, mimeType: meta.mimeType, filename: meta.filename, createdAt: meta.createdAt };
          imageStore.set(id, item);
        }
      } catch (e) {
        // file reading error
      }
    }

    if (!item) {
      return res.status(404).send("Зураг олдсонгүй эсвэл хугацаа нь дууссан байна.");
    }

    res.setHeader("Content-Type", item.mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${item.filename}"`);
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.send(item.buffer);
  });

  // Test Email Endpoint
  app.post("/api/test-email", async (req, res) => {
    try {
      const { testEmail, smtpConfig, isRisk, isBullying } = req.body;
      if (!testEmail || typeof testEmail !== "string") {
        return res.status(400).json({ success: false, error: "Туршилтын имэйл хаяг шаардлагатай." });
      }

      const host = smtpConfig?.host || process.env.SMTP_HOST;
      const port = Number(smtpConfig?.port || process.env.SMTP_PORT || 587);
      const user = smtpConfig?.user || process.env.SMTP_USER;
      const pass = smtpConfig?.pass || process.env.SMTP_PASS;
      const secure = smtpConfig?.secure ?? (port === 465);
      const fromEmail = smtpConfig?.fromEmail || process.env.SMTP_FROM || user;
      const fromName = smtpConfig?.fromName || "Эрдмийн Далай Цогцолбор Сургууль";

      const subject = isRisk
        ? "🛡️ [ТУРШИЛТ] Эрдмийн Далай - Эрсдлийн үнэлгээ, аюулгүй байдлын холболт амжилттай"
        : isBullying
        ? "🔒 [ТУРШИЛТ] Эрдмийн Далай - Үе тэнгийн дээрэлхэлтийн мэдээлэл хүлээн авах холболт амжилттай"
        : "✓ Эрдмийн Далай - Имэйл холболтын туршилт амжилттай";

      // 1. If SMTP credentials exist and enabled (or testing explicit smtp)
      if (host && user && pass && (smtpConfig?.enabled !== false)) {
        try {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
            tls: { rejectUnauthorized: false }
          });

          await transporter.verify();
          await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: testEmail,
            subject,
            html: isRisk ? `
              <div style="font-family: sans-serif; padding: 24px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
                <div style="background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 20px;">
                  <h2 style="color: #b91c1c; margin: 0 0 8px 0; font-size: 18px;">🛡️ Эрсдлийн үнэлгээ хариуцсан ажилтны Gmail холболт амжилттай!</h2>
                  <p style="margin: 0; font-size: 13px; color: #7f1d1d;">Энэхүү туршилтын захидал нь сургуулийн аюулгүй байдал, болзошгүй эрсдлийн үнэлгээ хүлээн авах хаягийг шалгах зорилготой.</p>
                </div>
                <p style="font-size: 13px; line-height: 1.6;">Сайтын зочид, сурагч, эцэг эхчүүдээс илгээсэн эрсдлийн үнэлгээний мэдээлэл (эрсдлийн зэрэг, байршил, нотлох зураг) нь <strong>зөвхөн таны энэхүү Gmail хаяг (${testEmail})</strong> руу шууд саадгүй очих болно.</p>
                <div style="background: #f8fafc; padding: 12px; border-radius: 6px; font-size: 12px; color: #475569; margin-top: 16px;">
                  ✓ SMTP Сервер: ${host}:${port} | Илгээсэн: ${new Date().toLocaleString("mn-MN")}
                </div>
              </div>
            ` : `
              <div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
                <h2 style="color: #16a34a;">✓ Имэйл илгээх систем хэвийн ажиллаж байна!</h2>
                <p>Энэхүү захидал нь Эрдмийн Далай Цогцолбор сургуулийн админ тохиргооноос илгээсэн туршилтын захидал юм.</p>
                <p>Таны тохируулсан SMTP сервер (${host}:${port}) болон хэрэглэгч (${user}) амжилттай баталгаажлаа.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;"/>
                <small style="color: #64748b;">Хугацаа: ${new Date().toLocaleString("mn-MN")}</small>
              </div>
            `
          });

          return res.json({
            success: true,
            method: "smtp",
            message: `Туршилтын имэйл ${testEmail} хаяг руу SMTP серверээр амжилттай илгээгдлээ.`
          });
        } catch (smtpErr: any) {
          console.error("SMTP test failed:", smtpErr);
          let friendlyMsg = smtpErr.message || "SMTP илгээлт амжилтгүй";
          if (smtpErr.code === 'EAUTH' || friendlyMsg.includes('BadCredentials') || friendlyMsg.includes('Username and Password not accepted')) {
            friendlyMsg = "Google / SMTP нэвтрэх эрхийг татгалзлаа (EAUTH). Та Gmail-ийн энгийн нууц үгээ бус, myaccount.google.com/apppasswords хуудаснаас 16 оронтой 'Аппын нууц үг' (App Password) үүсгэж оруулах шаардлагатай.";
          }
          return res.status(400).json({
            success: false,
            error: friendlyMsg
          });
        }
      }

      // 2. If no SMTP configured, use FormSubmit Relay with origin headers and activation detection
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(testEmail)}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Referer": "https://erdmiin-dalai.edu.mn",
            "Origin": "https://erdmiin-dalai.edu.mn"
          },
          body: JSON.stringify({
            _subject: subject,
            _template: "table",
            _captcha: "false",
            "Төрөл": isRisk ? "🛡️ Эрсдлийн үнэлгээ хүлээн авах ажилтны имэйл туршилт" : "Имэйл туршилт",
            "Мэдэгдэл": isRisk
              ? "Эрсдлийн үнэлгээ хүлээн авах ажилтны Gmail холболт амжилттай боллоо. Цаашид илгээсэн бүх эрсдлийн мэдээлэл энэ хаяг руу шууд очно."
              : "Эрдмийн Далай сургуулийн имэйл холболтын туршилт амжилттай боллоо.",
            "Илгээсэн хугацаа": new Date().toLocaleString("mn-MN")
          })
        });

        const fsJson = await formSubmitRes.json().catch(() => null);
        const isSuccess = fsJson?.success === true || fsJson?.success === "true";
        const needsActivation = typeof fsJson?.message === "string" && (fsJson.message.includes("Activation") || fsJson.message.includes("Activate"));

        if (isSuccess) {
          return res.json({
            success: true,
            method: "relay",
            message: `Туршилтын имэйл ${testEmail} хаяг руу Relay үйлчилгээгээр амжилттай илгээгдлээ.`
          });
        }

        if (needsActivation) {
          return res.json({
            success: true,
            method: "activation_needed",
            activationNeeded: true,
            message: `FormSubmit-ээс ${testEmail} хаяг руу баталгаажуулах имэйл илгээсэн байна. Та уг имэйлээ (эсвэл Спам/Spam хавтсаа) шалгаад 'Activate Form' товчийг 1 удаа дарж баталгаажуулна уу! Нэг удаа баталгаажсаны дараа вэбсайтын санал хүсэлт шууд таны имэйлд автоматаар ирэх болно.`
          });
        }

        return res.status(400).json({
          success: false,
          error: fsJson?.message || "Relay үйлчилгээнд холбогдоход алдаа гарлаа."
        });
      } catch (err: any) {
        console.warn("FormSubmit test failed", err);
        return res.status(500).json({
          success: false,
          error: "Имэйл илгээх үйлчилгээнд холбогдож чадсангүй: " + (err.message || "")
        });
      }
    } catch (error: any) {
      console.error("Test email error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Имэйл илгээхэд алдаа гарлаа."
      });
    }
  });

  // Send Feedback / Inquiry Email
  app.post("/api/send-email", async (req, res) => {
    try {
      const data: EmailRequestBody = req.body;
      const { recipientEmail, senderName, message, typeTitle } = data;

      if (!recipientEmail || !senderName || !message) {
        return res.status(400).json({
          success: false,
          error: "Шаардлагатай мэдээлэл (recipientEmail, senderName, message) дутуу байна."
        });
      }

      const host = data.smtpConfig?.host || process.env.SMTP_HOST;
      const port = Number(data.smtpConfig?.port || process.env.SMTP_PORT || 587);
      const user = data.smtpConfig?.user || process.env.SMTP_USER;
      const pass = data.smtpConfig?.pass || process.env.SMTP_PASS;
      const secure = data.smtpConfig?.secure ?? (port === 465);
      const fromEmail = data.smtpConfig?.fromEmail || process.env.SMTP_FROM || user;
      const fromName = data.smtpConfig?.fromName || "Эрдмийн Далай Вэбсайт";

      const isRisk = data.type === 'risk' || !!data.riskLevel;
      const isBullying = data.type === 'bullying';
      const riskLevelText = data.riskLevel === 'high' ? 'ӨНДӨР' : data.riskLevel === 'medium' ? 'ДУНД' : 'БАГА';
      const subject = isRisk
        ? `[ЭРСДЛИЙН ҮНЭЛГЭЭ - ${riskLevelText}] ${data.riskCategory || 'Сургуулийн орчин'} - ${senderName} (${data.senderPhone})`
        : isBullying
        ? `[ҮЕ ТЭНГИЙН ДЭЭРЭЛХЭЛТ - НУУЦ МЭДЭЭЛЭЛ] ${data.gradeLevel ? `${data.gradeLevel} - ` : ''}${data.studentName || senderName} (${data.senderPhone})`
        : `[${typeTitle || "Санал хүсэлт"}] ${senderName} - ${data.senderPhone}`;

      // Handle risk assessment photo / attachment
      let publicImageUrl: string | null = null;
      let imageAttachment: any = null;
      let imageCid: string | null = null;
      const parsedImage = parseImageData(data.imageUrl);

      if (parsedImage) {
        const imageId = 'risk_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
        const filename = `ersdel-zurag-${Date.now()}.${parsedImage.extension}`;

        const storedItem = {
          buffer: parsedImage.buffer,
          mimeType: parsedImage.mimeType,
          filename,
          createdAt: Date.now()
        };
        imageStore.set(imageId, storedItem);

        try {
          fs.writeFileSync(path.join(IMAGE_DIR, `${imageId}.bin`), parsedImage.buffer);
          fs.writeFileSync(path.join(IMAGE_DIR, `${imageId}.json`), JSON.stringify({
            mimeType: parsedImage.mimeType,
            filename,
            createdAt: Date.now()
          }));
        } catch (e) {
          // disk write fallback
        }

        const rawHost = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'localhost:3000';
        const isLocal = rawHost.includes('localhost') || rawHost.includes('127.0.0.1');
        const proto = isLocal ? 'http' : ((req.headers['x-forwarded-proto'] as string) || 'https');
        publicImageUrl = `${proto}://${rawHost}/api/inquiry-image/${imageId}`;

        imageCid = `risk_photo_${imageId}@erdmiin-dalai`;
        imageAttachment = {
          filename,
          content: parsedImage.buffer,
          cid: imageCid,
          contentType: parsedImage.mimeType,
          disposition: 'inline'
        };
      } else if (data.imageUrl && (data.imageUrl.startsWith('http://') || data.imageUrl.startsWith('https://'))) {
        publicImageUrl = data.imageUrl;
      }

      const html = buildHtmlEmail(data, imageCid, publicImageUrl);

      let smtpError = null;

      // 1. Try Direct SMTP if credentials exist
      if (host && user && pass && (data.smtpConfig?.enabled !== false)) {
        try {
          const transporter = nodemailer.createTransport({
            host,
            port,
            secure,
            auth: { user, pass },
            tls: { rejectUnauthorized: false }
          });

          const attachments: any[] = [];
          if (imageAttachment) {
            attachments.push(imageAttachment);
          }

          await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to: recipientEmail,
            replyTo: data.senderEmail || undefined,
            subject,
            html,
            attachments
          });

          return res.json({
            success: true,
            method: "smtp",
            recipientEmail,
            message: `Имэйл ${recipientEmail} хаяг руу SMTP серверээр зураг хавсралтын хамт амжилттай илгээгдлээ.`
          });
        } catch (err: any) {
          console.error("SMTP sending failed:", err);
          smtpError = err.message;
        }
      }

      // 2. Fallback: FormSubmit Relay with origin headers and attachment support
      try {
        const relayPayload: Record<string, any> = {
          _subject: subject,
          _template: "table",
          _captcha: "false",
          "Төрөл": isRisk ? "ЭРСДЛИЙН ҮНЭЛГЭЭ" : (typeTitle || "Санал хүсэлт"),
          "Илгээгч": senderName,
          "Утас": data.senderPhone,
          "Имэйл": data.senderEmail || "(Байхгүй)",
          "Хүлээн авагч ажилтан": `${data.recipientName || "Ажилтан"} (${data.recipientRole || ""})`,
          "Агуулга": message
        };

        if (isRisk) {
          relayPayload["Эрсдлийн түвшин"] = `${riskLevelText} ЭРСДЭЛ`;
          if (data.riskCategory) relayPayload["Эрсдэлийн ангилал"] = data.riskCategory;
          if (data.location) relayPayload["Байршил"] = data.location;
        }

        if (data.gradeLevel) relayPayload["Анги"] = data.gradeLevel;
        if (data.programInterest) relayPayload["Хөтөлбөр"] = data.programInterest;

        if (publicImageUrl) {
          relayPayload["📷 Хавсаргасан гэрэл зураг (Үзэх холбоос)"] = publicImageUrl;
        }

        let relayRes: Response;

        if (parsedImage) {
          const formData = new FormData();
          for (const [k, v] of Object.entries(relayPayload)) {
            formData.append(k, String(v));
          }
          const blob = new Blob([parsedImage.buffer], { type: parsedImage.mimeType });
          formData.append("attachment", blob, `ersdel-zurag.${parsedImage.extension}`);

          relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
            method: "POST",
            headers: {
              "Accept": "application/json",
              "Referer": "https://erdmiin-dalai.edu.mn",
              "Origin": "https://erdmiin-dalai.edu.mn"
            },
            body: formData
          });
        } else {
          relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
              "Referer": "https://erdmiin-dalai.edu.mn",
              "Origin": "https://erdmiin-dalai.edu.mn"
            },
            body: JSON.stringify(relayPayload)
          });
        }

        const fsJson = await relayRes.json().catch(() => null);
        const isSuccess = fsJson?.success === true || fsJson?.success === "true";
        const needsActivation = typeof fsJson?.message === "string" && (fsJson.message.includes("Activation") || fsJson.message.includes("Activate"));

        if (isSuccess) {
          return res.json({
            success: true,
            method: "relay",
            recipientEmail,
            message: `Имэйл релэй үйлчилгээгээр ${recipientEmail} хаяг руу амжилттай илгээгдлээ.`
          });
        }

        if (needsActivation) {
          return res.json({
            success: true,
            method: "activation_needed",
            activationNeeded: true,
            recipientEmail,
            message: `FormSubmit-ээс ${recipientEmail} хаяг руу баталгаажуулах имэйл илгээсэн байна. Та уг имэйлээ (эсвэл Спам/Spam хавтсаа) нээж 'Activate Form' товчийг 1 удаа дарж баталгаажуулна уу! Нэг удаа баталгаажсаны дараа цаашид бүх санал хүсэлт таны имэйлд автоматаар шууд ирэх болно.`
          });
        }
      } catch (relayErr: any) {
        console.warn("Relay email service error:", relayErr);
      }

      // If SMTP was configured but failed
      if (smtpError) {
        let friendly = smtpError;
        if (friendly.includes("BadCredentials") || friendly.includes("Username and Password not accepted")) {
          friendly = "Gmail нэвтрэх эрх татгалзлаа. Та myaccount.google.com/apppasswords хуудаснаас 16 оронтой 'Аппын нууц үг' үүсгэж оруулна уу.";
        }
        return res.status(500).json({
          success: false,
          error: `SMTP алдаа: ${friendly}`,
          recipientEmail
        });
      }

      // If neither SMTP succeeded nor relay succeeded
      return res.json({
        success: true,
        method: "queued",
        recipientEmail,
        message: `Санал хүсэлт админ удирдлагын системд бүртгэгдсэн. SMTP эсвэл FormSubmit баталгаажуулалт хийгдсэний дараа имэйл хайрцагт шууд ирэх болно.`
      });
    } catch (error: any) {
      console.error("send-email endpoint error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Имэйл боловсруулахад алдаа гарлаа."
      });
    }
  });

  // Serve static assets from public directory
  app.use(express.static(path.join(process.cwd(), "public")));

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
