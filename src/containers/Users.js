import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// import { Link } from 'react-router';

import * as actions from '../actions';

import ConfirmationPopUp from './ConfirmationPopUp';

import User from '../components/user';
import Input from '../components/input';

//import '../css/users.css';

class Users extends Component {

	constructor(props) {
		super(props);
		this.deleteUser = this.deleteUser.bind(this);
		this.updateUser = this.updateUser.bind(this);
		this.handleUsersChange = this.handleUsersChange.bind(this);
		this.handleAddUserForm = this.handleAddUserForm.bind(this);
		this.showPopUp = this.showPopUp.bind(this);
	}

	componentWillMount() {
		this.props.getUsers(this.props.user.token);
	}

	deleteUser(id) {		
		this.props.showPopUp({
			puFuncArgs: {
				token: this.props.user.token,
				id
			},
			puMessage: 'Вы уверены, что хотите удалить этого пользователя?',
			puClassName: 'delete-user',
			puButtonText: 'Да',
			puFadeTime: 60000
		});
	}

	updateUser(id) {
		this.submitId = id;
	}

	handleUsersChange(e) {
		e.preventDefault();
		let id = this.submitId;
		let oldUser;
		let userToUpdate = {
			id
		};
		for (let i = 0; i < this.props.adminUsers.length; i++) {
			if (id === this.props.adminUsers[i].id) {
				oldUser = this.props.adminUsers[i];
			}
		}
		for (let key in e.target) {
			if (!isNaN(key)) {
				let target = e.target[key];
				if (target.id.slice(-24) === id) {
					switch (target.id.slice(0, -25)) {
						case 'user_name': {
							userToUpdate.name = target.value;
							break;
						}
						case 'user_email': {
							userToUpdate.login = target.value;
							break;
						}
						case 'user_password': {
							if (target.value) {
								userToUpdate.pass = target.value;
							}
							break;
						}
						case 'user_blocked': {
							if (target.checked) {
								userToUpdate.role = 'banned';
							} else {
								userToUpdate.role = 'user';
							}
							break;
						}
						case 'user_organization': {
							userToUpdate.organization = target.value;
							break;
						}
						case 'user_phone': {
							userToUpdate.phone = target.value;
							break;
						}
						case 'user_comment': {
							userToUpdate.comment = target.value;
							break;
						}
						default: {
							if (!userToUpdate.role && userToUpdate.role !== 'banned') {
								userToUpdate.role = 'admin';
							}
						}
					}
				}
			}
		}
		if (
			userToUpdate.id &&
			userToUpdate.name &&
			userToUpdate.login && (
				userToUpdate.name !== oldUser.name ||
				userToUpdate.login !== oldUser.login ||
				userToUpdate.pass ||
				userToUpdate.organization !== oldUser.organization ||
				userToUpdate.phone !== oldUser.phone ||
				userToUpdate.comment !== oldUser.comment ||
				userToUpdate.role !== oldUser.role
			)
		) {
			this.props.updateUser(this.props.user.token, userToUpdate);
		}
	}

	handleAddUserForm(e) {
		e.preventDefault();
		let userToAdd = {};
		for (let key in e.target) {
			if (!isNaN(key)) {
				switch (e.target[key].id) {
					case 'add_user_name': {
						userToAdd.name = e.target[key].value;
						break;
					}
					case 'add_user_email': {
						userToAdd.login = e.target[key].value;
						break;
					}
					case 'add_user_password': {
						userToAdd.pass = e.target[key].value;
						break;
					}
					case 'add_user_organization': {
						userToAdd.organization = e.target[key].value;
						break;
					}
					case 'add_user_phone': {
						userToAdd.phone = e.target[key].value;
						break;
					}
					case 'add_user_comment': {
						userToAdd.comment = e.target[key].value;
						break;
					}
					default: {

					}
				}
			}
		}
		if (
			userToAdd.name &&
			userToAdd.login &&
			userToAdd.pass
		) {
			this.props.addUser(this.props.user.token, userToAdd);
		}
	}

	showPopUp() {
		let PopUp = null;
		if (this.props.popUp) {
			let options = this.props.popUp;
			let puFunction = () => this.props.deleteUser(options.puFuncArgs.token, options.puFuncArgs.id);
			PopUp = (
				<ConfirmationPopUp
					puButtonFunction={puFunction}
					puMessage={options.puMessage}
					puClassName={options.puClassName}
					puButtonText={options.puButtonText} />
			);
		}
		return PopUp;
	}

	render() {
		let Users;
		if (this.props.adminUsers.length !== 0) {
			Users = this.props.adminUsers.map((user, index) => {
				let updateError = false,
						updating = false,
						updated = false;
				if (this.props.errors[`duplicate_user_login_${user.id}`]) {
					if (this.props.errors[`duplicate_user_login_${user.id}`].status) {
						updateError = true;
					}
				}
				if (this.props.processes[`updating_user_${user.id}`]) {
					if (this.props.processes[`updating_user_${user.id}`].status) {
						updating = true;
					}
				}
				if (this.props.processes[`updated_user_${user.id}`]) {
					if (this.props.processes[`updated_user_${user.id}`].status) {
						updated = true;
					}
				}
				return (
					<User 
						key={user.id}
						index={index}
						updateError={updateError}
						updating={updating}
						updated={updated}
						user={user}
						deleteUser={this.deleteUser}
						updateUser={this.updateUser} />
				);
			});
		}
		return (
			<div>
				{this.showPopUp()}
				<h2>Пользователи</h2>
				<form onSubmit={this.handleUsersChange}>
					<table className="instruments users">
						<tbody>
							<tr className="table-header">
								<td>№</td>
								<td>Имя</td>
								<td>E-Mail (логин)</td>
								<td>Изменить пароль</td>
								<td>Организация</td>
								<td>Телефон</td>
								<td>Комментарий</td>
								<td>Заблокирован</td>
								<td></td>
								<td></td>
							</tr>
							{Users}
						</tbody>
					</table>
				</form>
				<form onSubmit={this.handleAddUserForm} className="adduser">
					<div>
						<label>ФИО:</label>
						<Input inputId="add_user_name" inputType="text" required={true} />
						<label>E-Mail (логин):</label>
						<Input inputId="add_user_email" inputType="email" required={true} />
						<label>Пароль:</label>
						<Input inputId="add_user_password" inputType="password" required={true} />
					</div>
					<div>
						<label>Организация:</label>
						<Input inputId="add_user_organization" inputType="text" />
						<label>Телефон:</label>
						<Input inputId="add_user_phone" inputType="text" />
						<label>Комментарий:</label>
						<Input inputId="add_user_comment" inputType="text" />
					</div>
						<input type="submit" value="Добавить"/>
				</form>
			</div>
		);
	}

}

function mapStateToProps(state) {
	return {
		user: state.user,
		adminUsers: state.adminUsers,
		processes: state.processes,
		errors: state.errors,
		popUp: state.popUp
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getUsers: actions.getUsers,
		deleteUser: actions.deleteUser,
		updateUser: actions.updateUser,
		addUser: actions.addUser,
		showPopUp: actions.showPopUp
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Users);