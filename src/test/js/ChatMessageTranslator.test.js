import translatorFor from 'ChatMessageTranslator';
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

        chatListener.hasReceivedJoinedRequestFrom(null)
    });

    it('translate joining message from others', () => {
        translateEvent({data: '"jack"'})

        chatListener.hasReceivedJoinedRequestFrom('jack')
    });

    it('translate normal message from others', () => {
        translateEvent({data: '{"from":"jack", "message": "ok"}'})

        chatListener.hasReceivedMessageFrom('jack', 'ok')
    });

    it('report error when failed', () => {
        translateEvent({type: 'error'})

        chatListener.hasFailed()
    });
});

