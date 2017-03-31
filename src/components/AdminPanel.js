import React, { Component } from 'react';
import { Link } from 'react-router';

export default class MainMenu extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<div className="main-menu">
				<h1>Панель администратора</h1>
				<div id="__wrapper">
					<h2>Меню</h2>
					<ul className="admin-menu">
						<li><Link to="sessions-list">Сессии</Link></li>
						<li><Link to="users">Пользователи</Link></li>
					</ul>
				</div>
			</div>
		);
	}

}