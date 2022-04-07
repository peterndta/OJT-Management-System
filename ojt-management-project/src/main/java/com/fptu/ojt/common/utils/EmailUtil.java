package com.fptu.ojt.common.utils;

import com.fptu.ojt.mappers.ApplicationMapper;
import com.fptu.ojt.utils.JwtUtils;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.Map;

@NoArgsConstructor
public class EmailUtil {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    public void notify(String to, String subject, String html, JavaMailSender emailSender) throws MessagingException {
        MimeMessage message = emailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message,true,"UTF-8");

        helper.setFrom("noreply@mail.com");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(html,true);

        emailSender.send(message);
        logger.info("Email sent to " + to);
    }

    public String getTemplate(Map<String,String> paramMap, SpringTemplateEngine templateEngine, String templateName) {
        Context context = new Context();
        String html = templateEngine.process(templateName,context);
        return this.replaceParameter(paramMap,html);
    }

    private String replaceParameter(Map<String,String> paramMap, String html){
        for(Map.Entry<String,String> set: paramMap.entrySet()){
            html = html.replace(set.getKey(),set.getValue());
        }
        return html;
    }
}
