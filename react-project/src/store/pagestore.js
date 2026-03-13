import { create } from "zustand";



const usePagestore = create((set)=>({
    page:'Dashboard',

    changepage:(p)=>set({page:p})
          
}))
export default usePagestore;