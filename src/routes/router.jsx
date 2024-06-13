import {createBrowserRouter} from "react-router-dom";
import Main from "../layouts/Main.jsx";
import Home from "../components/Home.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Main />,
        children: [
            {
                path: '/',
                element: <Home />
            }
        ]
    },
]);