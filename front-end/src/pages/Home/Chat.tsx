import styled from "styled-components";
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
} from "@chatscope/chat-ui-kit-react";
import { useState } from "react";
import { MessageModel } from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.css";
import { TypingIndicator } from "@chatscope/chat-ui-kit-react";


const API_KEY = "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";

const Container = styled.div`
    width: 100%;
    height: 100%;

    .chatbot-container {
        background-color: white;
        border: black 1px;
        box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
        height: 96%;
        margin: 1%;
        border-radius: 20px;
        padding: 3%;
    }

    .outgoing-message {
        
    }
`;

type Props = {
    toggleSideBar: Function;
    sidebarOpened: boolean;
    setImageResults: Function;
}


const Chat = (props: Props) => {
    const [typing, setTyping] = useState(false);

    const [messageStack, setMessageStack] = useState<MessageModel[]>
        ([
            {
                message: "안녕하세요",
                sender: "user",
                direction: "outgoing", // outgoing or incoming
                position: 'single' // 챗 구름 모양
            }
            ,{
                message: "안녕하세요 안녕하세요 안녕하세요 안녕하세요",
                sender: "ChatGPT",
                direction: "incoming", // outgoing or incoming
                position: 'single' // 챗 구름 모양
            }
        ]);



    const handleSend = async (message: string) => {
        // console.log(message);
        const newMessage: MessageModel = {
            message: message,
            sender: 'user',
            direction: 'outgoing',
            position: 'single'
        }
        /*  CHANGE THIS LOGIC WITH CHATGPT */
        const newMessageStack = [...messageStack, newMessage];
        setMessageStack(newMessageStack);
        setTyping(true);
        await processMessageToChatGPT(newMessageStack);
    }




    /* 
    이 펑션이 여기있는 메세지스택을 (내가 보낸 챗 포함)
    1. 챗지피티 api 콜하고 
    2. 답변받고, 
    3. 메세지스택 업데이트
    4. 그 외 것들 (typing status update)
    5. (해야할 것) 구글 서치 엔진 api 콜해서 이미지 가져오기
    6. (해야할 것) 그 이미지들 (링크들) 정리해서 props.setImageResults 로 링크들 다 넣어주기
    7. (해야할 것) 이미지 다 받았으면, props.toggleSideBar 콜해서 사이드바 열어주기 
    참고*** 
    여기에서 인스트럭션(시나리오 / 몸무게 / 키 등 environment variable) 짜서 넣어놔야합니다  
    */
    async function processMessageToChatGPT(messageStack : MessageModel[]) {
        let apiMessages = messageStack.map((messageObject: MessageModel) => {
            let role = "";
            if(messageObject.sender === "ChatGPT") {
                role = "assistant";
            }
            else {
                role = "user";
            }
            return { role: role, content: messageObject.message }
        })
        // 다른 펑션이든 뭐든 이니셜 인스트럭션 (시나리오) 짜서 apiRequestBody -> messages 어레이안에 먼저 넣어놓기
        const apiRequestBody = {
            "model" : "gpt-3.5-turbo",
            "messages" : [
                ...apiMessages
            ]
        }

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization" : "Bearer " + API_KEY,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => {
            return data.json();
        }).then((data) => {
            let responseContent = data.choices[0].message.content;
            let response: MessageModel = {
                message: responseContent,
                sender: "ChatGPT",
                direction: "incoming",
                position: "single"
            }
            setMessageStack(
                [...messageStack, response]
            )
            setTyping(false);
        })
    }

    return (
        <Container>
            <div className="chatbot-container">
                <MainContainer style={{ border: "transparent" }}>
                    <ChatContainer>
                        <MessageList
                            typingIndicator={typing ? <TypingIndicator content="ChatGPT is typing"/> : null}
                        >
                            {
                                messageStack.map((message, i) => {
                                    return (
                                        <Message
                                            className={message.direction === "outgoing" ? "outgoing-message" : "incoming-message"}
                                            key={i} model={message} />
                                    )
                                })
                            }

                        </MessageList>
                        <MessageInput
                            placeholder='채팅을 쳐보세요!' attachButton={false} sendButton={false}
                            style={{ border: "transparent", height: "10%" }}
                            onSend={handleSend} />
                    </ChatContainer>
                </MainContainer>

                {/* <button onClick={temp}>toggle</button> */}
            </div>
        </Container>
    )
}
export default Chat;