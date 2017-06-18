import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router';

import * as actions from '../actions';

//here be components

//import '../css/class.css';

class SessionPage extends Component {

	constructor(props) {
		super(props);
		this.state = {
			page: +(this.props.params.page.slice(5))
		}
	}

	componentWillMount() {
		this.getSessions(this.props);
	}

	componentWillReceiveProps(nextProps) {
		this.getSessions(nextProps);
	}

	getSessions(props) {
		let sessions = props.sessions;
		if ((sessions.sessionsCount && sessions.pagesCount && !sessions.sessions) || sessions.page !== this.state.page) {
			if (this.state.page === '' || isNaN(this.state.page) || this.state.page > sessions.pagesCount || this.state.page <= 0) {
				this.setState({
					error: 'Ошибка: неправильный путь'
				});
			} else {
				this.props.getSessions(
					props.user.token, 
					this.state.page, 
					props.sessions.sessionsCount,
					props.sessions.pagesCount, 
					props.sessions.sessionsPerPage,
				);
			}
		}
	}

	handleSessions() {
		if (this.state.error) {
			return <p className="error">{this.state.error}</p>
		}
		let Sessions = this.props.sessions.sessions ? this.props.sessions.sessions.map((session, index) => {
			return (
				<Link className="session-link" key={index} to={`/admin/session/id_${session.id}`}>
					{`${session.start} - ${session.end}`}
				</Link>
			);
		}) : null;
		return Sessions;
	}

	getPagination() {
		let paginationArray = [];
		let page = this.state.page;
		let lastPage = this.props.sessions.pagesCount;
		let isFirstPageVisible = false;
		let isFirstPageNear = false;
		let isLastPageVisible = false;
		let isLastPageNear = false;
		for (let i = page - 2; i < page + 2; i++) {
			if (i === 1) isFirstPageVisible = true;
			if (i === lastPage) isLastPageVisible = true;
			if (i === 2) isFirstPageNear = true;
			if (i === lastPage - 1) isLastPageNear = true;
			if (i > 0 && i <= lastPage) {
				paginationArray.push(i);
			}
		}
		paginationArray = paginationArray.map((page, index) => {
			return(
				<Link 
					to={page !== this.state.page ? `/admin/sessions/page_${page}` : ''}
					key={index}
					className={page !== this.state.page ? 'pagination-link' : 'pagination-link active'}
				>
					{page}
				</Link>
			);
		});
		if (!isFirstPageVisible) {
			paginationArray.unshift((
				<Link to="/admin/sessions/page_1" className={isFirstPageNear ? 'pagination-link' : 'pagination-link first'}>1{isFirstPageNear ? '' : '..'}</Link>
			));
		}
		if (!isLastPageVisible) {
			paginationArray.push((
				<Link to={`/admin/sessions/page_${lastPage}`} className={isLastPageNear ? 'pagination-link' : 'pagination-link last'}>{isLastPageNear ? '' : '..'}{lastPage}</Link>
			));	
		}
		return paginationArray;
	}


	render() {
		return (
			<div key={this.props.location.pathname} className="sessions-page">
				{this.handleSessions()}
				<div className="pagination">
					{this.props.sessions.sessions && this.getPagination()}
				</div>
			</div>
		);
	}

}



function mapStateToProps(state) {
	return {
		user: state.user,
		sessions: state.sessions
	};
}

function matchDispatchToProps(dispatch) {
	return bindActionCreators({
		getSessions: actions.getSessions
	}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(SessionPage);