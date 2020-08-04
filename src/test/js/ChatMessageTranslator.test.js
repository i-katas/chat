import translatorFor from 'ChatMessageTranslator';
import MockChatListener from './mocks/MockChatListener'

describe('ChatMessageTranslator', () => {
    let chatListener;
    let translator;

    beforeEach(() => {
        chatListener = new MockChatListener();
        translator = translatorFor(chatListener);
    })

    it('translate self joining message', () => {
        translator({data: null})

        chatListener.hasReceivedJoinedRequestFrom(null)
    });

    it('translate joining message from others', () => {
        translator({data: '"jack"'})

        chatListener.hasReceivedJoinedRequestFrom('jack')
    });

    it('translate normal message from others', () => {
        translator({data: '{"from":"jack", "message": "ok"}'})

        chatListener.hasReceivedMessageFrom('jack', 'ok')
    });
});

