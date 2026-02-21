import {create} from "zustand"
import { axiosInstance } from "../lib/axios"
import { toast } from "react-hot-toast";
import {useAuthStore} from "./UseAuthStore"

const notification = new Audio("/sound/notification.mp3");

export const useChatStore = create((set,get) =>({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "Chats",
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") || "true"),

    toggleItem: () => {
        const newValue = !get().isSoundEnabled;
        localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
        set({ isSoundEnabled: newValue });
    },


    setActiveTab: (tab)=> set({activeTab: tab}),
    setSelectedUser: (selectedUser)=> set({selectedUser}),

    getAllContacts: async()=>{
        set({isUserLoading:true})
        try {
            const res = await axiosInstance.get("/message/contacts");
            set({allContacts: res.data})
        } catch (error) {
            toast.error(error.response?.data?.message)
        }finally{
            set({isUserLoading:false})
        }
    },

    getMyChatPartners: async()=>{
        set({isUserLoading: false})
        try {
            const res = await axiosInstance.get("/message/chats");
            set({chats: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message);
        }finally{
            set({isUserLoading: false});
        }
    },

    getMessagesByUserId: async(userId)=>{
        set({isMessageLoading: true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }finally{
            set({isMessageLoading: false})
        }
    },

    sendMessage: async(messageData)=>{
        const {selectedUser, messages} = get()
        const {authUser} = useAuthStore.getState();

        const tempId = `temp-${Date.now()}`

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            recieverId: selectedUser._id,
            text: messageData.text,
            image: messageData.image,
            createdAt: new Date().toISOString(),
            isOptimistic: true
        }

        set({messages: [...messages, optimisticMessage]})
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]})
        } catch (error) {
            //aremoving optis=mistic message on failed
            set({messages: messages})
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    subscribeToMessage: () => {
        const socket = useAuthStore.getState().socket;
        const {selectedUser} = get()  
        if (!socket) return;

        socket.off("newMessage"); // prevent duplicates

        socket.on("newMessage", (newMessage) => {
            const isMessageIsSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageIsSentFromSelectedUser) return;
            set((state) => ({
            messages: [...state.messages, newMessage]
            }));

            if (get().isSoundEnabled) {
                notification.currentTime = 0; 
                notification.play().catch((err)=> console.log("Audio play failed", err))
            }
        });
    },

    unSubscribeToMessages: ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage")
    }
})) 