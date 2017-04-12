import React, { Component } from 'react';

import Input from './input';
import Checkbox from './checkbox';

export default class User extends Component {

	constructor(props) {
		super(props);
		this.deleteUser = this.deleteUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
	}

// №
// Имя
// E-Mail
// Изменить пароль
// Организация
// Номер
// Комментарий

	deleteUser(e) {
		e.preventDefault();
		let id = +e.target.id.slice(12);
		this.props.deleteUser(id);
	}

	updateUser(e) {
		let id = +e.target.id.slice(12);
		this.props.updateUser(id);
	}

	render() {
		let user = this.props.user;
		let userBlocked = this.props.user.role_id === 0 ? true : false;
		return (
			<tr>
				<td>{this.props.index + 1}</td>
				<td><Input inputId={`user_name_${user.id}`} inputType="text" inputValue={user.fio}/></td>
				<td><Input inputId={`user_email_${user.id}`} inputType="email" inputValue={user.user_name}/></td>
				<td><Input inputId={`user_password_${user.id}`} inputType="password" /></td>
				<td><Input inputId={`user_organization_${user.id}`} inputType="text" inputValue={user.organization} /></td>
				<td><Input inputId={`user_phone_${user.id}`} inputType="text" inputValue={user.phone} /></td>
				<td><Input inputId={`user_comment_${user.id}`} inputType="text" inputValue={user.comment} /></td>
				<td><Checkbox checkboxId={`user_blocked_${user.id}`} checkboxChecked={userBlocked} /></td>
				<td><button
					id={`user_button_${user.id}`}
					disabled={this.props.updating}
					onClick={this.updateUser}
					className={this.props.updated ? 'success' : ''}>{this.props.updated ? 'Обновлено' : 'Обновить'}</button></td>
				<td><button className="delete-instrument" id={`delete_user_${user.id}`} onClick={this.deleteUser}></button></td>
			</tr>
		);
	}

};
