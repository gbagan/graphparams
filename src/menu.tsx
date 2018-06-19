import * as React from "react";
import { Link } from "react-router-dom";

const menu = [
    {
        title: "Graphs",
        submenu: [
            { link: "/graph/params", title: "Parameters"},
            { link: "/graph/eds", title: "Eternal Domination"},
        ],
    },
    {
        title: "Solvers",
        submenu: [
            { link: "/solvers/nonogram", title: "Nonogram" },
            { link: "/solvers/lightsout", title: "Light Outs" },
            { link: "/solvers/chiffres", title: "Le compte est bon" },
            { link: "/solvers/sudoku", title: "Sudoku" },
        ],
    },
    {
        title: "Games",
        submenu:[
            { link: "/games/queens", title: "8 Queens"},
            { link: "/games/pegsolitaire", title: "Peg solitaire"},
        ]
    }
];

const render: React.SFC<{}> = props =>
    <span>
    {
        menu.map(({submenu}) =>
            submenu.map(({link, title}) =>
                <React.Fragment>
                    <Link to={link}>{title}</Link> | 
                </React.Fragment>
            )
        )
    }
    </span>

export default render;