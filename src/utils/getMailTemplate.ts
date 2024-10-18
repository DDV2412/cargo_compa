export const getMailTemplate = ({
  name,
  link,
  heading,
  messageContentHtml,
}: {
  name: string;
  link: string;
  heading: string;
  messageContentHtml: string;
}) => {
  return `
  <table style="width:100%;max-width:700px;margin:0 auto;border-spacing:0;border:none;padding:32px" width="100%">
        <tbody>
            <tr>
                <td style="font-family:Verdana,Geneva,Tahoma,sans-serif;text-align:center;padding:32px 0">
                    <img src="${link}/images/Logo.png"
                        alt="Cargo Compa" style="width:60px;height:60px;object-fit:contain" width="60" height="60"
                        class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                </td>
            </tr>
            <tr>
                <td
                    style="font-family:Verdana,Geneva,Tahoma,sans-serif;background-color:#f9f9f9;padding:24px;border-radius:8px;box-shadow: 0 4px 24px rgba(0,0,0, 0.05);">
                    <h1 style="font-size:28px;font-weight:600;text-align:center;margin:0 0 40px 0">${heading}</h1>
                    <p>Hello ${name},</p>
                    ${messageContentHtml}
                    <p>If you have any questions, feel free to contact our support team at
                        <a href="mailto:support@cargocompa.com"
                            target="_blank">support@cargocompa.com</a>.
                    </p>
                </td>
            </tr>
            <tr>
                <td
                    style="font-family:Verdana,Geneva,Tahoma,sans-serif;text-align:center;padding:16px 0;font-size:small;color:#666">
                    <p>© 2024 Cargo Compa. All rights reserved.</p>
                    <p>Cargo Compa | Level 1, 12 Sample St, Sydney NSW 2000</p>
                    <div>
                        <a href="${link}" class="m_-5790671141660064763social_link"
                            style="color:#007bff;text-decoration:none" target="_blank">
                            <img src="${link}/images/Instagram.webp"
                                alt="Instagram" style="width:18px;height:18px;opacity:0.2" width="18" height="18"
                                class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                        </a>
                        <a href="${link}" class="m_-5790671141660064763social_link"
                            style="color:#007bff;text-decoration:none" target="_blank">
                            <img src="${link}/images/linkedin.webp"
                                alt="Linkedin" style="width:18px;height:18px;opacity:0.2" width="18" height="18"
                                class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                        </a>
                    </div>
                    <div style="margin-top:16px">
                        <a href="${link}/privacy-policy" style="color:#007bff;text-decoration:none"
                            target="_blank">Privacy
                            Policy</a> ·
                        <a href="${link}/terms-condition" style="color:#007bff;text-decoration:none"
                            target="_blank">Terms
                            of Service</a>
                    </div>
                    <p><a href="${link}" style="color:#007bff;text-decoration:none" target="_blank">Visit
                            our website</a></p>
                </td>
            </tr>
        </tbody>
    </table>
`;
};
