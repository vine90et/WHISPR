import {create} from "zustand"
import { axiosInstance } from "../lib/axios"

export const useChatStore = create((set,get) =>({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "Chats",
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,
    isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") || "true"),
    onlineUsers: [],

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
})) 