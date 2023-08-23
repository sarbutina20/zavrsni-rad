import Cookies from "js-cookie";
import { redirect } from "react-router-dom";
export const actionOdjava = () => {
    Cookies.remove('token');
    window.location.reload()
    return redirect('/')
}