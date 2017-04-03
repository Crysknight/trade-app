import React, { Component } from 'react';
import { Link } from 'react-router';

export default class AdminMenu extends Component {

	// constructor(props) {
		// super(props);

	// }

	render() {
		return (
			<div>					
				<h2>Меню</h2>
				<ul className="admin-menu">
					<li><Link to="/trade-app/admin/sessions">Сессии</Link></li>
					<li><Link to="/trade-app/admin/users">Пользователи</Link></li>
				</ul>
			</div>
		);
	}

}