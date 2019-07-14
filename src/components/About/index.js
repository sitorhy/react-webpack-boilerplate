import React from "react";
import styles from "./about.module.less";

console.log(styles)

class About extends React.Component
{
    render()
    {
        return (
            <div className={styles.about}>
                <div className={styles.logo}></div>
            </div>
        );
    }
}

export default About;