import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function GET(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const inquiry = await prisma.contactMessage.findUnique({ where: { id } })

    if (!inquiry) {
      return NextResponse.json({ error: '询盘不存在' }, { status: 404 })
    }

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('获取询盘失败:', error)
    return NextResponse.json({ error: '获取失败' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const existing = await prisma.contactMessage.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: '询盘不存在' }, { status: 404 })
    }

    const body = await request.json()
    const data = {}

    if (body.isRead !== undefined) data.isRead = !!body.isRead
    if (body.reply !== undefined) {
      data.reply = body.reply
      data.repliedAt = new Date()

      // Send reply email via SMTP
      if (body.reply && existing.email) {
        sendReplyEmail(existing, body.reply).catch(err =>
          console.error('发送回复邮件失败:', err.message)
        )
      }
    }

    const inquiry = await prisma.contactMessage.update({
      where: { id },
      data,
    })

    return NextResponse.json(inquiry)
  } catch (error) {
    console.error('更新询盘失败:', error)
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  const auth = requireAdmin(request)
  if (!auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const id = parseInt(params.id)
    const existing = await prisma.contactMessage.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: '询盘不存在' }, { status: 404 })
    }

    await prisma.contactMessage.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('删除询盘失败:', error)
    return NextResponse.json({ error: '删除失败' }, { status: 500 })
  }
}

async function sendReplyEmail(inquiry, replyText) {
  const nodemailer = require('nodemailer')

  const host = process.env.SMTP_HOST
  if (!host) {
    console.log('[Inquiry Reply] SMTP not configured')
    return
  }

  const transporter = nodemailer.createTransport({
    host,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  const storeName = 'Zen Craft Bracelets'
  const fromEmail = process.env.EMAIL_FROM || 'Zen Craft Bracelets <noreply@myzenbeads.com>'

  await transporter.sendMail({
    from: fromEmail,
    to: inquiry.email,
    subject: `Re: ${inquiry.subject} — ${storeName}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0; padding:0; background:#f5f5f0; font-family:-apple-system, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td style="padding:40px 16px;">
      <table width="560" cellpadding="0" cellspacing="0" style="margin:0 auto;max-width:560px;">
        <tr>
          <td style="background:linear-gradient(135deg,#8B0000 0%,#C41E3A 100%);padding:32px;text-align:center;border-radius:8px 8px 0 0;">
            <h1 style="color:#D4AF37;margin:0;font-size:22px;font-weight:400;letter-spacing:2px;">${storeName}</h1>
            <p style="color:#fff;margin:4px 0 0;font-size:13px;opacity:0.8;">您的询盘已回复</p>
          </td>
        </tr>
        <tr>
          <td style="background:#fff;padding:32px;border-radius:0 0 8px 8px;">
            <p style="color:#555;font-size:14px;margin:0 0 16px;">
              <strong>${inquiry.name}</strong>，您好！
            </p>
            <p style="color:#555;font-size:14px;margin:0 0 16px;">
              感谢您联系 ${storeName}。以下是您之前提交的询盘及我们的回复：
            </p>

            <div style="background:#FAFAF5;border-left:3px solid #8B0000;padding:16px;margin-bottom:20px;border-radius:4px;">
              <p style="color:#888;font-size:12px;margin:0 0 6px;">您的原始询盘：</p>
              <p style="color:#555;font-size:13px;margin:0 0 4px;"><strong>主题：</strong>${escapeHtml(inquiry.subject)}</p>
              <p style="color:#555;font-size:13px;margin:0;">${escapeHtml(inquiry.message)}</p>
            </div>

            <div style="background:#F0F8F0;border-left:3px solid #28a745;padding:16px;border-radius:4px;">
              <p style="color:#888;font-size:12px;margin:0 0 6px;">我们的回复：</p>
              <p style="color:#333;font-size:14px;margin:0;line-height:1.6;">${escapeHtml(replyText)}</p>
            </div>

            <div style="border-top:1px solid #eee;margin-top:24px;padding-top:16px;">
              <p style="color:#999;font-size:12px;margin:0;">
                如有其他问题，欢迎再次联系我们。
              </p>
              <p style="color:#999;font-size:12px;margin:4px 0 0;">— ${storeName} 团队</p>
            </div>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })

  console.log(`[Inquiry Reply] Replied to ${inquiry.email} regarding "${inquiry.subject}"`)
}

function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
