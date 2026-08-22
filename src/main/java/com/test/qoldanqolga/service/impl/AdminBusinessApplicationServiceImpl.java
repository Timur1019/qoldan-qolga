package com.test.qoldanqolga.service.impl;

import com.test.qoldanqolga.dto.business.BusinessApplicationDto;
import com.test.qoldanqolga.dto.chat.SendMessageRequest;
import com.test.qoldanqolga.mapper.BusinessApplicationMapper;
import com.test.qoldanqolga.model.BusinessApplication;
import com.test.qoldanqolga.repository.BusinessApplicationRepository;
import com.test.qoldanqolga.repository.UserRepository;
import com.test.qoldanqolga.service.AdminBusinessApplicationService;
import com.test.qoldanqolga.service.chat.ConversationCommandService;
import com.test.qoldanqolga.service.chat.MessageCommandService;
import com.test.qoldanqolga.config.SystemConversationProperties;
import com.test.qoldanqolga.exception.ResourceNotFoundException;
import com.test.qoldanqolga.util.LogUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminBusinessApplicationServiceImpl implements AdminBusinessApplicationService {

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_APPROVED = "APPROVED";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STORE_APPROVED_MESSAGE =
            "🎉 Поздравляем! Ваша заявка на статус «Магазин» одобрена. Теперь ваши объявления и сообщения отображаются с бейджем «Магазин».";

    private final BusinessApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final BusinessApplicationMapper mapper;
    private final ConversationCommandService conversationCommandService;
    private final MessageCommandService messageCommandService;
    private final SystemConversationProperties systemConversationProperties;

    @Override
    public Page<BusinessApplicationDto> list(Pageable pageable, String statusFilter) {
        Page<BusinessApplication> page = (statusFilter != null && !statusFilter.isBlank())
                ? applicationRepository.findAllByStatusOrderByCreatedAtDesc(statusFilter.trim(), pageable)
                : applicationRepository.findAllByOrderByCreatedAtDesc(pageable);
        return page.map(mapper::toDto);
    }

    @Override
    public BusinessApplicationDto getById(String id) {
        BusinessApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка", id));
        return mapper.toDto(app);
    }

    @Override
    @Transactional
    public void approve(String id) {
        BusinessApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка", id));
        if (STATUS_APPROVED.equals(app.getStatus())) {
            LogUtil.warn(AdminBusinessApplicationServiceImpl.class, "Application already approved: id={}", id);
            return;
        }
        app.setStatus(STATUS_APPROVED);
        applicationRepository.save(app);

        String userId = app.getUserId();
        if (userId != null && !userId.isBlank()) {
            userRepository.findById(userId).ifPresent(u -> {
                u.setStoreVerified(true);
                userRepository.save(u);
            });
            String convId = conversationCommandService.getOrCreateSystemConversation(userId);
            String systemUserId = systemConversationProperties.getUserId();
            SendMessageRequest messageRequest = new SendMessageRequest();
            messageRequest.setText(STORE_APPROVED_MESSAGE);
            messageCommandService.sendMessage(convId, systemUserId, messageRequest);
        }
        LogUtil.info(AdminBusinessApplicationServiceImpl.class, "Business application approved: id={} userId={}", id, userId);
    }

    @Override
    @Transactional
    public void reject(String id) {
        BusinessApplication app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Заявка", id));
        app.setStatus(STATUS_REJECTED);
        applicationRepository.save(app);
        LogUtil.info(AdminBusinessApplicationServiceImpl.class, "Business application rejected: id={}", id);
    }
}
