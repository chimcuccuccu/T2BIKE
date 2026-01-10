package com.example.bikeshop.service;

import com.example.bikeshop.entity.PasswordResetToken;
import com.example.bikeshop.entity.User;
import com.example.bikeshop.repository.PasswordResetTokenRepository;
import com.example.bikeshop.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PasswordResetService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private JavaMailSender mailSender;

    // Tạo token và gửi link reset email
    public void sendResetLink(String email, String frontendUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        String token = UUID.randomUUID().toString(); // token dài ngẫu nhiên

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15)); // 15 phút
        tokenRepository.save(resetToken);

        String link = frontendUrl + "?token=" + token;

        // Gửi email
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("[T2BIKE] Đặt lại mật khẩu");

            String htmlContent = """
        <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 30px; border-radius: 8px;">
                
                <h2 style="color: #333;">Xin chào <b>%s</b>,</h2>

                <p style="color: #555; font-size: 15px;">
                    Chúng tôi nhận được yêu cầu <b>đặt lại mật khẩu</b> cho tài khoản T2BIKE của bạn.
                </p>

                <p style="color: #555; font-size: 15px;">
                    Nhấn vào nút bên dưới để tạo mật khẩu mới.  
                    <span style="color: #888;">(Liên kết có hiệu lực trong 15 phút)</span>
                </p>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="%s"
                       style="background-color: #007bff;
                              color: white;
                              padding: 12px 24px;
                              text-decoration: none;
                              border-radius: 5px;
                              font-weight: bold;
                              display: inline-block;">
                        Đặt lại mật khẩu
                    </a>
                </div>

                <p style="color: #888; font-size: 13px;">
                    Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                </p>

                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">

                <p style="color: #999; font-size: 12px;">
                    Trân trọng,<br>
                    <b>T2BIKE Team</b>
                </p>
            </div>
        </div>
        """.formatted(user.getUsername(), link);

            helper.setText(htmlContent, true); // true = HTML
            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Gửi email reset mật khẩu thất bại", e);
        }
    }

    // Xác thực token
    public User validateToken(String token) {
        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token không hợp lệ"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token đã hết hạn");
        }

        return resetToken.getUser();
    }

    // Xóa token sau khi dùng
    public void deleteToken(String token) {
        tokenRepository.findByToken(token).ifPresent(tokenRepository::delete);
    }
}
