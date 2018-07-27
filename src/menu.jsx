import Menu from 'antd/lib/menu';
import * as React from 'react';
import { Link } from 'react-router-dom';

const menu = [
    {
        title: 'Graphs',
        submenu: [
            { link: '/graph/params', title: 'Parameters' },
            { link: '/graph/eds', title: 'Eternal Domination' },
        ],
    },
    {
        title: 'Solvers',
        submenu: [
            { link: '/solvers/nonogram', title: 'Nonogram' },
            { link: '/solvers/lightsout', title: 'Light Outs' },
            { link: '/solvers/chiffres', title: 'Le compte est bon' },
            { link: '/solvers/sudoku', title: 'Sudoku' },
        ],
    },
];


const render = () => (
    <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode='horizontal'
    >
        {menu.map(({ title, submenu }, i) =>
            <Menu.SubMenu key={i} title={title}>{
                submenu.map(({ link, title }, j) =>
                    <Menu.Item key={j}><Link to={link}>{title}</Link></Menu.Item>
                )
            }</Menu.SubMenu>
        )}
    </Menu>
);

export default render;