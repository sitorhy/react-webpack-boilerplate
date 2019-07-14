import App from "../components/App";
import Home from "../components/Home";
import About from "../components/About";

const routes = [
    {
        path: "/",
        component: App,
        indexRoute: {
            component: Home
        },
        childRoutes: [
            {
                path: "home",
                component: Home
            },
            {
                path: "about",
                component: About
            }
        ]
    }
];

export default routes;