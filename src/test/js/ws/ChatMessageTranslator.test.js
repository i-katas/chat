import translatorFor from 'ws/ChatMessageTranslator';
import MockChatListener from './mocks/MockChatListener'

describe('ChatMessageTranslator', () => {
    let chatListener;
    let translateEvent;

    beforeEach(() => {
        chatListener = new MockChatListener();
        translateEvent = translatorFor(chatListener);
    })

    it('translate self joining message', () => {
        translateEvent({data: null})

        chatListener.hasReceivedJoinRequestFrom(null)
    });

    it('translate joining message from others', () => {
        translateEvent({data: '"jack"'})

        chatListener.hasReceivedJoinRequestFrom('jack')
    });

    it('translate normal message from others', () => {
        translateEvent({data: '{"from":"jack", "message": "ok"}'})

        chatListener.hasReceivedMessageFrom('jack', 'ok')
    });
});

