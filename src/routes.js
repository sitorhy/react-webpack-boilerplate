import App from "./components/App"
import Home from "./components/Home"
import About from "./components/About"
import Welcome from "./components/Welcome"
import ToDo from "./components/ToDo"

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
                component: Home,
                childRoutes:[
                    {
                        path:"about",
                        component:About
                    },
                    {
                        path:"welcome",
                        component:Welcome
                    },
                    {
                        path:"todo",
                        component:ToDo
                    }
                ]
            }
        ]
    }
];

export default routes;