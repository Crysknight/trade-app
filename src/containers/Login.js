import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import * as actions from '../actions';

import '../css/login.css';

class Login extends Component {
  constructor(props) {
  	super(props);
  	this.submitUser = this.submitUser.bind(this);
  	this.handleInput = this.handleInput.bind(this);
  	this.state = {
  	  login: undefined,
  	  pass: undefined
  	};
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.user.role === 'admin') {
      document.location = '/admin/';
    } else if (
      JSON.stringify(nextProps.user) !== '{}' && 
      !nextProps.user.error
    ) {
      browserHistory.push('/');
    }
  }
  submitUser(event) {
  	event.preventDefault();
  	if (this.state.login !== undefined && this.state.pass !== undefined) {
  	  this.props.checkUser({ login: this.state.login, pass: this.state.pass });
    }
  }
  handleInput(event) {
  	if (event.target.id === 'auth__email') {
  	  this.setState({ login: event.target.value });
  	} else if (event.target.id === 'auth__password') {
  	  this.setState({ pass: event.target.value });
  	}
    if (this.props.user.error) {
      this.props.tryLoginAgain();
    }
  }
  render() {
    let resultBlock;
    if (JSON.stringify(this.props.user) !== '{}') {
      switch (this.props.user.error) {
        case 'wrong user': {
          console.log('You\'re liar!');
          resultBlock = <div className="errorBlock">Неверный логин и/или пароль</div>;
          break;
        }
        case 'internal server error': {
          resultBlock = <div className="errorBlock">Ошибка сервера</div>;
          break;
        }
        default: {
          resultBlock = <div className="successBlock"></div>;
        }
      }
    }
    if (this.props.processes['login_from_other_location']) {
      if (this.props.processes['login_from_other_location'].status) {
        resultBlock = <div className="errorBlock">Ошибка сервера</div>;
      }
    }
    return (
      <div id="page" className="mm-page mm-slideout">

        <div className="mobile-header">
            <div className="container">
                <div className="row">
                    <div className="col-sm-9 col-md-9 col-9">
                        <a href="/" className="logo">
                        <img src="img/mobile_logo.svg" alt="" />
                    </a>
                    </div>
                    <div className="col-sm-3 col-md-3 col-3">
                        <div className="hamburger" id="hamburger-1">
                            <span className="line"></span>
                            <span className="line"></span>
                            <span className="line"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="menu-mobile">
            <div className="container-full">
                <div className="container-lines row">
                    <div className="col-6">
                        <ul className="languages-mobile">
                            <li><a href="">ENG</a></li>
                            <li><a className="active" href="">RUS</a></li>
                        </ul>
                    </div>
                    <div className="col-6">
                        <a href="auth.html" className="open">Открыть счет</a>
                    </div>
                </div>

                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <strong>Компания</strong>
                            <ul className="menu-list-mobile">
                                <li><a href="news.html">Новости</a></li>
                                <li><a href="">О компании</a></li>
                                <li><a href="ranking.html">Рэнкинги</a></li>
                                <li><a href="licenses.html">Лицензии</a></li>
                                <li><a href="single-news.html">Раскрытие информации</a></li>
                                <li><a href="">Реквезиты</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <strong>Брокерское обслуживание</strong>
                            <ul className="menu-list-mobile">
                                <li><a href="">Структурные продукты</a></li>
                                <li><a href="">ИИС</a></li>
                                <li><a href="">Конверсионные операции</a></li>
                                <li><a href="">Персональный брокер</a></li>
                                <li><a href="">Маржинальное кредитование</a></li>
                                <li><a href="">Доход на остаток</a></li>
                                <li><a href="">РЕПО с ЦК</a></li>
                                <li><a href="">Документы и реквезиты</a></li>
                                <li><a href="">Депозитарное обслуживание</a></li>
                                <li><a href="">Торговый терминал</a></li>
                                <li><a href="">Клафицированный инвестор</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <a href="">
                            <strong>Аналитика и котировки</strong>
                        </a>
                        </div>
                    </div>
                </div>
                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <a href="">
                            <strong>Аукцион</strong>
                        </a>
                        </div>
                    </div>
                </div>
                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <a href="">
                            <strong>Личный кабинет</strong>
                        </a>
                        </div>
                    </div>
                </div>
                <div className="container-menu-mobile">
                    <div className="container row">
                        <div className="col-12" style={{ padding: 0 }}>
                            <a href="">
                            <strong>Контакты</strong>
                        </a>
                        </div>
                    </div>
                </div>

                <div className="container-footer-menu">
                    <div className="container row">
                        <ul className="footer-menu">
                            <li><a href="">Условия использования</a></li>
                            <li><a href="">Политика конфиденциальности</a></li>
                            <li><a href="http://plan-b.agency">Разработано в Plan B</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div id="wrapper" className="sub">

            <header>
                <a href="/" className="logo">
                <img src="img/logo.svg" alt="" />
            </a>

                <a href="#menu-desktop" className="menu">Главное меню</a>


                <div id="menu-desktop" style={{ display: "none" }}>

                    <div className="container-block-menu">

                        <a href="auth.html" className="open">Открыть счет</a>

                        <strong>Компания</strong>
                        <ul>
                            <li><a href="news.html">Новости</a></li>
                            <li><a href="">О компании</a></li>
                            <li><a href="ranking.html">Рэнкинги</a></li>
                            <li><a href="licenses.html">Лицензии</a></li>
                            <li><a href="single-news.html">Раскрытие информации</a></li>
                            <li><a href="">Реквизиты</a></li>
                        </ul>

                        <strong>Брокерское<br />обслуживание</strong>
                        <ul>
                            <li><a href="">Структурные продукты</a></li>
                            <li><a href="">ИИС</a></li>
                            <li><a href="">Конверсионные<br />операции</a></li>
                            <li><a href="">Персональный брокер</a></li>
                            <li><a href="">Маржинальное<br />кредитование</a></li>
                            <li><a href="">Доход на остаток</a></li>
                            <li><a href="">РЕПО с ЦК</a></li>
                            <li><a href="">Документы и реквезиты</a></li>
                            <li><a href="">Депозитарное<br />обслуживание</a></li>
                            <li><a href="">Торговый терминал</a></li>
                            <li><a href="">Клафицированный<br />инвестор</a></li>
                        </ul>

                        <a href="" className="title">Аналитика и<br />котировки</a>

                        <a href="" className="title">Аукционы</a>

                        <a href="" className="title">Контакты</a>

                    </div>

                </div>

                <div className="container-bottom">
                    <div className="languages">
                        <span className="active">RUS</span> <a href="/en/">ENG</a>
                    </div>

                    <div className="logo-name">
                        <a href="">Элемент Капитал</a>
                    </div>
                </div>
            </header>

            <section className="auth">
                <div className="container">
                    <div className="block-auth">
                        <strong>Елемент Капитал</strong>
                        <h1>Личный кабинет</h1>
                        <form id="auth" className="auth" onSubmit={this.submitUser}>
                          <input 
                            id="auth__email" 
                            type="email" 
                            placeholder="E-mail" 
                            required
                            onChange={this.handleInput}
                          />
                          <input 
                            id="auth__password" 
                            type="password" 
                            placeholder="Password" 
                            required
                            onChange={this.handleInput}
                          />
                          <button type="submit">Войти</button>
                        </form>
                        {resultBlock}
                    </div>
                </div>
            </section>

        </div>
        <footer>
            <div className="logo-name">&copy; Element, 2011-2017. Все права защищены.</div>
            <ul className="menu-footer">
                <li><a href="">Условия использования</a></li>
                <li><a href="">Политика конфиденциальности</a></li>
            </ul>
            <div className="planb"><a href="http://plan-b.agency">Разработано в Plan B</a></div>
        </footer>
        <style>{`
          
*
{
    font-family: 'Lato', Helvetica, Arial, sans-serif;

    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    margin: 0;
    padding: 0;

    outline: none;

    font-variant-numeric: lining-nums;
    -webkit-font-feature-settings: 'lnum';
            font-feature-settings: 'lnum';
}

#jGrowl
{
    display: none !important;
}

div,
header
{
    display: block;
    overflow: hidden;
}

a
{
    text-decoration: none;
}

a:hover
{
    text-decoration: none;
}

h1,
h2,
h3,
h4
{
    margin: 0;
}

button
{
    border: none;
}

*::-webkit-input-placeholder
{
    color: #000;
}

*:-moz-placeholder
{
    color: #000;
}

*::-moz-placeholder
{
    color: #000;
}

*:-ms-input-placeholder
{
    color: #000;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
{
    margin: 0;
    /* display: none; <- Crashes Chrome on hover */

    -webkit-appearance: none;
}

body
{
    font-size: 16px;

    position: relative;

    min-width: 320px;
}

ul
{
    margin: 0;

    list-style: none;
}

section
{
    overflow: hidden;
}

#wrapper
{
    min-height: -webkit-calc(100vh - 57px);
    min-height:         calc(100vh - 57px);
}

#wrapper.sub
{
    background: #f8f8f8;
}

body.mobile header
{
    display: none;
}

body.mobile .container
{
    margin-left: auto;
}

body.mobile .mobile-header
{
    display: block;
}

body.mobile #wrapper
{
    padding-top: 46px;
}

body.mobile footer
{
    margin-left: 0;
}

body.mobile section.line-breadcrumb
{
    padding-left: 0;
}

header
{
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;

    width: 80px;
    height: 100vh;
    padding: 30px 8px;

    border-right: 1px solid #cecece;
    border-left: 1px solid #cecece;
    background: #fff;
}

header a.logo
{
    position: relative;

    display: block;

    width: 40px;
    margin: 0 auto 50px auto;
}

header a.logo:after
{
    position: absolute;
    bottom: -30px;
    left: 0;

    width: 100%;
    height: 1px;

    content: '';

    background: rgba(0, 0, 0, .1);
}

header a.menu
{
    font-size: 11px;
    font-weight: 400;

    position: relative;

    display: block;

    width: 45px;
    height: 80px;
    margin-bottom: 50px;
    margin-left: 7px;
    padding: 32px 0 32px 20px;

    -webkit-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
            transform: rotate(-90deg);
    text-transform: uppercase;

    opacity: .5;
    color: #000;
    background: url('../img/menu.svg') no-repeat left center;
    background-size: 11px;
}

header a.menu:hover
{
    opacity: 1;
}

header a.menu-opened
{
    background: url('../img/close.svg') no-repeat left center;
    background-size: 11px;
}

header .container-bottom
{
    position: absolute;
    bottom: 30px;
    left: 0;

    overflow: visible;

    width: 80px;
    height: 230px;
}

header .languages
{
    font-size: 12px;

    position: relative;

    width: 111px;
    margin-bottom: 100px;
    margin-left: -17px;

    -webkit-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
            transform: rotate(-90deg);
    text-transform: uppercase;

    color: #7f7f7f;
}

header .languages a,
header .languages span
{
    display: block;

    width: 45px;
    margin: 0 5px;
    padding: 8px 12px;

    -webkit-transition: .3s;
            transition: .3s;

    -webkit-border-radius: 4px;
            border-radius: 4px;
}

header .languages a
{
    float: left;

    color: rgba(0, 0, 0, .6);
}

header .languages a:hover
{
    color: #000;
    background: #e5e5e5;
}

header .languages span,
header .languages a.active
{
    float: left;

    color: #000;
    background: #e5e5e5;
}

header .logo-name
{
    position: relative;

    width: 135px;
    height: 80px;
    margin-left: -30px;
    padding: 30px 0;

    -webkit-transform: rotate(-90deg);
        -ms-transform: rotate(-90deg);
            transform: rotate(-90deg);
}

header .logo-name a
{
    font-size: 14px;
    font-weight: 700;

    color: #000;
}

#menu-desktop
{
    background: #fff;
}

#success_popup
{
    position: relative;
}

#success_popup .block_form_popup
{
    height: auto;
}

#success_popup .block_form_popup .block-auth h1
{
    margin-bottom: 10px;
}

.mm-panel.mm-hasnavbar .mm-navbar
{
    display: none !important;
}

.mm-panels > .mm-panel:after,
.mm-panels > .mm-panel:before
{
    display: none !important;
}

.container-block-menu
{
    padding: 0 30px 30px 30px !important;
}

.container-block-menu strong,
.container-block-menu a.title
{
    font-size: 15px;
    font-weight: 800;
    line-height: 18px;

    display: block;

    color: #000;
}

.container-block-menu a.open
{
    font-size: 12px;

    position: relative;

    display: block;

    margin: 30px 0 65px 0;
    padding: 10px 0;

    cursor: pointer;
    -webkit-transition: .3s;
            transition: .3s;
    text-align: center;

    color: rgba(0, 0, 0, .6);
    border: 1px solid rgba(0, 0, 0, .6);
    -webkit-border-radius: 4px;
            border-radius: 4px;
}

.container-block-menu a.open:hover
{
    color: #fff;
    background: #000;
}

.container-block-menu a.open:after
{
    position: absolute;
    bottom: -28px;
    left: 0;

    width: 100%;
    height: 1px;

    content: '';

    background: rgba(0, 0, 0, .1);
}

.container-block-menu a.title
{
    margin-bottom: 25px;
}

.mm-panels > .mm-panel > .mm-listview
{
    margin: 15px 0 15px 0 !important;
}

.mm-panels > .mm-panel > .mm-listview li:after
{
    display: none;
}

.mm-panels > .mm-panel > .mm-listview li a
{
    font-size: 13px;
    font-weight: 400;

    display: block;

    padding: 0 0 10px 0;

    -webkit-transition: .3s;
            transition: .3s;

    opacity: .7;
    color: #000;
}

.mm-panels > .mm-panel > .mm-listview li a:hover
{
    opacity: 1;
}

.mm-panels ul
{
    margin: 15px 0 !important;
}

.mm-panels li.level1 a
{
    font-size: 15px !important;
    font-weight: 800 !important;
    line-height: 18px;

    display: block !important;

    margin-bottom: 15px !important;

    opacity: 1 !important;
    color: #000 !important;
}

#menu-mobile li.level1
{
    display: block;

    padding: 25px 0;

    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

#menu-mobile li.level1 a
{
    font-size: 18px;
    font-weight: 600;

    display: block;

    margin-right: auto;
    margin-left: auto;
    padding-right: 15px;
    padding-left: 15px;

    color: #000;
}

.mm-panels li.level1:last-child a
{
    margin-bottom: 0 !important;
}

.mobile-header
{
    position: fixed;
    z-index: 999;
    top: 0;
    left: 0;

    display: none;

    width: 100%;
    height: 47px;

    border-bottom: 1px solid rgba(0, 0, 0, .1);
    background: #fff;
}

.mobile-header a.logo
{
    display: block;

    max-width: 142px;
    padding: 15px 0;
}

.mobile-header a.logo img
{
    display: block;

    width: 100%;
}

.hamburger
{
    float: right;

    padding: 15px 0;
}

.hamburger .line
{
    display: block;

    width: 12px;
    height: 2px;
    margin: 2px auto;

    -webkit-transition: all .3s ease-in-out;
            transition: all .3s ease-in-out;

    background-color: #000;
}

.hamburger:hover
{
    cursor: pointer;
}

/* ONE */

#hamburger-1.is-active .line:nth-child(2)
{
    opacity: 0;
}

#hamburger-1.is-active .line:nth-child(1)
{
    -webkit-transform: translateY(4px) rotate(45deg);
        -ms-transform: translateY(4px) rotate(45deg);
            transform: translateY(4px) rotate(45deg);
}

#hamburger-1.is-active .line:nth-child(3)
{
    -webkit-transform: translateY(-4px) rotate(-45deg);
        -ms-transform: translateY(-4px) rotate(-45deg);
            transform: translateY(-4px) rotate(-45deg);
}

#menu-mobile
{
    position: fixed;
    z-index: 99;
    top: 0;
    left: 0;

    display: none;
    overflow: scroll;

    width: 100%;
    height: 100vh;
    padding-top: 47px;

    background: #fff;

    -webkit-overflow-scrolling: touch;
}

#menu-mobile .container-footer-menu
{
    padding: 20px 0;

    background: #e2e2e2;
}

#menu-mobile .container-footer-menu ul.footer-menu li
{
    margin-bottom: 10px;
}

#menu-mobile .container-footer-menu ul.footer-menu li a
{
    font-size: 14px;
    font-weight: 400;

    display: block;

    -webkit-transition: .3s;
            transition: .3s;

    color: rgba(0, 0, 0, .6);
}

#menu-mobile .container-footer-menu ul.footer-menu li a:hover
{
    color: #000;
}

#menu-mobile .container-footer-menu ul.footer-menu li:last-of-type
{
    margin-bottom: 0;
}

#menu-mobile .container-menu-mobile
{
    padding: 25px 0;

    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

#menu-mobile .container-menu-mobile:last-child
{
    border: none;
}

#menu-mobile .container-menu-mobile a strong
{
    margin-bottom: 0;

    color: #000;
}

#menu-mobile .container-menu-mobile strong
{
    font-size: 18px;
    font-weight: 600;

    display: block;

    margin-bottom: 10px;
}

#menu-mobile .container-menu-mobile ul.menu-list-mobile li a
{
    font-size: 14px;
    font-weight: 400;

    display: block;

    margin-bottom: 10px;

    -webkit-transition: .3s;
            transition: .3s;

    color: rgba(0, 0, 0, .6);
}

#menu-mobile .container-menu-mobile ul.menu-list-mobile li a:hover,
#menu-mobile .container-menu-mobile ul.menu-list-mobile li a:active,
#menu-mobile .container-menu-mobile ul.menu-list-mobile li a:focus
{
    color: #000;
}

#menu-mobile .row
{
    margin-right: 0;
    margin-left: 0;
}

#menu-mobile .container
{
    margin: auto;
}

.container-lines
{
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

.container-lines .col-6
{
    padding: 18px 0;
}

.container-lines .col-6:first-child
{
    border-right: 1px solid rgba(0, 0, 0, .1);
}

.container-lines ul.languages-mobile
{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;

    width: 100%;
    max-width: 120px;
    margin: auto;

    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
            justify-content: space-between;
}

.container-lines ul.languages-mobile li
{
    margin: 0 5px;
}

.container-lines ul.languages-mobile li a
{
    font-size: 14px;
    font-weight: 400;

    display: block;

    padding: 8px 12px;

    -webkit-transition: .3s;
            transition: .3s;
    text-transform: uppercase;

    color: rgba(0, 0, 0, .5);
    -webkit-border-radius: 4px;
            border-radius: 4px;
}

.container-lines ul.languages-mobile li a:hover
{
    color: #000;
    background: #e5e5e5;
}

.container-lines ul.languages-mobile li a.active
{
    color: #000;
    background: #e5e5e5;
}

.container-lines a.open
{
    font-size: 12px;
    font-weight: 400;

    display: block;

    width: 100%;
    max-width: 140px;
    margin: auto;
    padding: 10px 0;

    -webkit-transition: .3s;
            transition: .3s;
    text-align: center;

    color: rgba(0, 0, 0, .6);
    border: 1px solid rgba(0, 0, 0, .6);
    -webkit-border-radius: 4px;
            border-radius: 4px;
}

.container-lines a.open:hover
{
    color: #fff;
    background: #000;
}

footer
{
    overflow: hidden;

    padding: 15px 30px;

    background: #333;
}

footer .logo-name,
footer ul.menu-footer,
footer .planb
{
    display: inline-block;

    vertical-align: middle;
}

footer .logo-name
{
    font-size: 13px;
    font-weight: 400;

    margin-right: 25px;

    color: #fff;
}

footer ul.menu-footer
{
    height: 27px;
}

footer ul.menu-footer li
{
    display: inline-block;

    margin-top: 0;
    margin-right: 25px;
    margin-bottom: 0;
}

footer ul.menu-footer li a
{
    font-size: 13px;
    font-weight: 400;

    -webkit-transition: .3s;
            transition: .3s;

    color: rgba(255, 255, 255, .6);
}

footer ul.menu-footer li a:hover
{
    color: white;
}

footer .planb
{
    float: right;
}

footer .planb a
{
    font-size: 13px;
    font-weight: 400;

    -webkit-transition: .3s;
            transition: .3s;

    color: rgba(255, 255, 255, .6);
}

footer .planb a:hover
{
    color: white;
}

section.main-screen
{
    position: relative;

    height: 100vh;
    padding: 200px 0;

    background: url('../img/bg.png') no-repeat center center;
    background-size: cover;
}

section.main-screen:after
{
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    content: '';

    opacity: .7;
    background: #111;
}

section.main-screen .container
{
    position: static;
}

section.main-screen .container .col-lg-12
{
    position: absolute;
    z-index: 9;
    top: 50%;

    height: 300px;
    margin-top: -150px;

    color: #fff;
}

.small-title
{
    margin-bottom: 10px;
}

.small-title strong
{
    font-size: 11px;
    font-weight: 600;

    text-transform: uppercase;

    color: white;
}

.title-main
{
    margin-bottom: 40px;
}

.title-main h1
{
    font-size: 40px;
    font-weight: 300;
    line-height: 55px;
}

.title-main h1 b
{
    font-weight: 500;
}

.container-buttons-main-screen a.button
{
    font-size: 12px;
    font-weight: 700;

    display: inline-block;

    width: 200px;
    height: 50px;
    padding: 16px 0;

    -webkit-transition: .3s;
            transition: .3s;
    text-align: center;
    letter-spacing: 1px;
    text-transform: uppercase;

    color: #fff;
    border: 1px solid #fff;
    -webkit-border-radius: 5px;
            border-radius: 5px;
}

.container-buttons-main-screen a.button:hover
{
    color: #000;
    background: #fff;
}

.container-buttons-main-screen a.button-string
{
    font-size: 12px;
    font-weight: 700;

    display: inline-block;

    margin-left: 20px;

    letter-spacing: 1px;
    text-transform: uppercase;

    color: #fff;
}

section.about-main
{
    padding: 70px 0;

    background: -webkit-gradient(linear, left top, right top, from(#f2f2f2), to(#fff));
    background: -webkit-linear-gradient(left, #f2f2f2, #fff);
    background:         linear-gradient(90deg, #f2f2f2, #fff);
}

section.about-main .title-section
{
    margin-bottom: 30px;
}

section.about-main .title-section h2
{
    font-size: 50px;
    font-weight: 200;
    line-height: 60px;

    color: #666;
}

section.about-main .title-section h2 span
{
    font-weight: 300;

    color: #000;
}

section.about-main .text-section p
{
    font-size: 16px;
    font-weight: 400;

    color: #000;
}

section.about-main .container-features
{
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;

    margin-top: 30px;
    padding: 0;

    -webkit-box-pack: justify;
    -webkit-justify-content: space-between;
    -ms-flex-pack: justify;
            justify-content: space-between;
}

section.about-main .container-features .container-item-feature
{
    padding: 0 15px;
}

section.about-main .container-features .container-item-feature .line
{
    width: 1%;
    height: 1px;
    margin-bottom: 20px;

    background: #e6e6e6;
}

section.about-main .container-features .container-item-feature:first-child
{
    padding: 0 15px 0 0;
}

section.about-main .container-features .item-feature
{
    position: relative;

    overflow: visible;
}

section.about-main .container-features .item-feature .icon
{
    display: block;

    width: 70px;
    height: 70px;
    margin-top: 20px;
    margin-bottom: 15px;
}

section.about-main .container-features .item-feature .icon img
{
    max-width: 100%;
    height: 100%;
}

section.about-main .container-features .item-feature .text-feature strong
{
    font-size: 12px;
    font-weight: 800;

    display: block;

    margin-bottom: 10px;

    text-transform: uppercase;

    color: #000;
}

section.about-main .container-features .item-feature .text-feature p
{
    font-size: 12px;
    font-weight: 400;

    opacity: .5;
    color: #000;
}

.small-text-section
{
    overflow: visible;
}

.small-text-section strong
{
    font-size: 16px;
    font-weight: 700;

    position: relative;

    display: inline-block;
    overflow: visible;

    padding-top: 10px;

    color: #000;
}

.small-text-section strong:before
{
    position: absolute;
    top: 0;
    left: 0;

    width: 40px;
    height: 3px;

    content: '';

    background: #00aeef;
}

section.exchange
{
    position: relative;

    padding: 65px 0 300px 0;

    color: #fff;
    background-color: #111;
    background-image: url('../img/Graphics.png'), url('../img/dots.png');
    background-repeat: no-repeat, no-repeat;
    background-position: bottom center, center center;
    background-size: contain, cover;
}

section.exchange .container
{
    position: relative;
    z-index: 9;
}

section.exchange .small-text-section
{
    margin-bottom: 30px;
}

section.exchange .small-text-section strong
{
    color: #fff;
}

section.exchange .title-section-exchange
{
    margin-bottom: 30px;
}

section.exchange .title-section-exchange h2
{
    font-size: 50px;
    font-weight: 200;
    line-height: 60px;
}

section.exchange .title-section-exchange h2 span
{
    font-weight: 300;
}

section.exchange .text-section p
{
    font-size: 16px;
    font-weight: 400;

    opacity: .75;
}

section.exchange .container-cards
{
    margin-top: 20px;
}

section.exchange .item-card
{
    width: 220px;
    margin-bottom: 40px;
    padding: 10px;

    -webkit-transition: .3s;
            transition: .3s;

    -webkit-border-radius: 8px;
            border-radius: 8px;
    background: #fff;
    -webkit-box-shadow: 8px 0 40px rgba(0, 0, 0, .3);
            box-shadow: 8px 0 40px rgba(0, 0, 0, .3);
}

section.exchange .item-card:hover
{
    -webkit-box-shadow: 8px 0 40px rgba(0, 0, 0, .7);
            box-shadow: 8px 0 40px rgba(0, 0, 0, .7);
}

section.exchange .item-card a.url
{
    font-size: 11px;
    font-weight: 400;

    display: block;
    float: right;

    margin-top: 35px;

    text-transform: uppercase;

    color: #000;
}

section.exchange .item-card .logo
{
    width: 50px;
}

section.exchange .item-card .logo img
{
    max-width: 100%;
}

section.exchange .item-card:nth-child(2)
{
    background: #555;
}

section.exchange .item-card:nth-child(2) a.url
{
    color: #fff;
}

section.header
{
    padding: 45px 0;

    background: url('../img/pattern-header.svg') repeat center center #333;
    background-size: 1000px;
}

section.header .category-grey
{
    margin-bottom: 5px;
}

section.header .category-grey strong
{
    font-size: 11px;
    font-weight: 700;

    display: block;

    text-transform: uppercase;

    color: #fff;
}

section.header .title-header h1
{
    font-size: 30px;
    font-weight: 500;

    color: #fff;
}

section.detail
{
    padding: 45px 0;

    background: #f8f8f8;
}

section.detail h1,
section.detail p h1
{
    font-size: 30px;
    font-weight: 700;

    display: block;

    margin-bottom: 7px;

    color: #000;
}

section.detail h2,
section.detail p h2
{
    font-size: 16px;
    font-weight: 700;

    margin-bottom: 6px;

    color: #000;
}

section.detail p
{
    font-size: 16px;
    font-weight: 400;

    margin-bottom: 30px;

    color: #000;
}

section.detail span.image
{
    font-size: 12px;

    display: block;

    margin: 10px 0 20px 0;

    color: rgba(0, 0, 0, .6);
}

section.detail img
{
    display: block;

    margin: 20px 0;
}

section.detail img.full
{
    width: 100%;
}

section.detail img.small
{
    display: inline-block;

    width: 48%;
    margin: 30px 3% 30px 0;
}

section.detail img.small:nth-child(2n)
{
    margin-right: 0;
}

section.detail p strong,
section.detail strong
{
    font-size: 16px;
    font-weight: 700;

    position: relative;

    display: block;

    margin-bottom: 15px;
    padding-top: 10px;

    color: #000;
}

section.detail p strong:after,
section.detail strong:after
{
    position: absolute;
    top: 0;
    left: 0;

    width: 40px;
    height: 3px;

    content: '';

    background: #00aeef;
}

section.detail p a
{
    display: inline;

    margin: 0 5px 0 0;
    padding: 0 13px 0 0;

    color: #0070c9;
    border: none !important;
    background: url('../img/arrow.svg') no-repeat right bottom 3px;
    background-size: 8px;
}

section.detail a
{
    display: block;

    margin-top: 20px;
    margin-right: -15px;
    margin-bottom: 20px;
    margin-left: -15px;
    padding: 25px 30px 25px 95px;

    -webkit-transition: .3s;
            transition: .3s;

    border: 1px solid rgba(51, 51, 51, .25);
    background-color: #fff;
    background-image: url('../img/download.svg');
    background-repeat: no-repeat;
    background-position: left 30px center;
    background-size: 30px;
}

section.detail a:hover
{
    border: 1px solid #00aeef;
}

section.detail a span.title
{
    font-size: 16px;
    font-weight: 700;

    display: block;

    margin-bottom: 7px;

    color: #000;
}

section.detail a span.info-left,
section.detail a span.info-right
{
    font-size: 11px;
    font-weight: 400;

    display: inline-block;

    vertical-align: top;
}

section.detail a span.info-left
{
    margin-right: 50px;

    color: #000;
}

section.detail a span.info-right
{
    opacity: .6;
    color: #000;
}

section.detail a.external
{
    background-image: url('../img/link.svg');
}

section.detail blockquote
{
    font-size: 16px;
    font-weight: 700;

    opacity: .5;
    color: #000;
}

section.detail .container-table
{
    margin-right: -15px;
    margin-left: -15px;
}

section.detail table
{
    overflow: hidden;

    width: 100%;
    margin: 15px 0 35px 0;

    border-collapse: collapse;

    -webkit-border-radius: 5px;
            border-radius: 5px;
    background: #efefef;
    -webkit-box-shadow: 1px 0 10px rgba(0, 0, 0, .15);
            box-shadow: 1px 0 10px rgba(0, 0, 0, .15);
}

section.detail table tbody
{
    width: 100%;
}

section.detail table tbody tr:first-child td
{
    font-size: 11px;
    font-weight: 700;

    padding: 15px;

    text-transform: uppercase;

    color: #fff;
    background: #666;
}

section.detail table tbody tr:first-child td:first-child
{
    -webkit-border-radius: 5px 0 0 0;
            border-radius: 5px 0 0 0;
}

section.detail table tbody tr:first-child td:last-child
{
    -webkit-border-radius: 0 5px 0 0;
            border-radius: 0 5px 0 0;
}

section.detail table tbody tr td
{
    font-size: 11px;
    font-weight: 500;

    padding: 15px;

    color: #000;
}

section.detail table tbody tr:nth-child(2n)
{
    background: #fff;
}

section.detail table tbody tr:last-child td:first-child
{
    -webkit-border-radius: 0 0 5px 0;
            border-radius: 0 0 5px 0;
}

section.detail table tbody tr:last-child td:last-child
{
    -webkit-border-radius: 0 0 0 5px;
            border-radius: 0 0 0 5px;
}

section.detail table tbody tr.bold
{
    border-top: 2px solid #666;
    background: #fff;
}

section.detail table tbody tr.bold td
{
    font-weight: 700;
}

section.detail .container-table-result table tbody tr:last-child
{
    border-top: 2px solid #666;
    background: #fff;
}

section.detail .container-table-result table tbody tr:last-child td
{
    font-weight: 700;
}

section.detail .container-blocks
{
    margin: 25px -15px;
}

section.detail .container-blocks div
{
    float: left;

    width: 49%;
    margin-bottom: 20px;
    padding: 20px;

    border: 1px solid rgba(51, 51, 51, .25);
    background: #fff;
}

section.detail .container-blocks div span
{
    font-size: 11px;
    font-weight: 400;

    margin-bottom: 8px;

    text-transform: uppercase;

    opacity: .5;
    color: #000;
}

section.detail .container-blocks div h2
{
    font-size: 16px;
    font-weight: 600;

    color: #000;
}

section.detail .container-blocks div p
{
    font-size: 12px;
    font-weight: 600;

    margin: 0;

    opacity: .6;
    color: #000;
}

section.detail .container-blocks div:nth-child(2n)
{
    margin-left: 2%;
}

section.detail ul,
section.detail ol
{
    margin: 20px 0;
}

section.detail ul li
{
    font-size: 16px;
    font-weight: 400;

    position: relative;

    margin-bottom: 10px;
    padding-left: 30px;

    color: #000;
}

section.detail ul li:after
{
    font-size: 12px;
    font-weight: 900;

    position: absolute;
    top: 2px;
    left: 0;

    width: 22px;
    height: 22px;

    content: '';
    text-align: center;

    color: #00aeef;
    border: 2px solid #00aeef;
    -webkit-border-radius: 999px;
            border-radius: 999px;
    background: url('../img/icon-arrow-list.png') no-repeat center center;
}

section.detail ol
{
    list-style: none;

    counter-reset: point;
}

section.detail ol li
{
    font-size: 16px;
    font-weight: 400;

    position: relative;

    margin-bottom: 10px;
    padding-left: 30px;

    color: #000;
}

section.detail ol li:after
{
    font-size: 11px;
    font-weight: 700;

    position: absolute;
    top: 2px;
    left: 0;

    width: 22px;
    height: 22px;
    padding-top: 1px;

    content: counter(point);
    counter-increment: point 1;
    text-align: center;

    color: #00aeef;
    border: 2px solid #00aeef;
    -webkit-border-radius: 999px;
            border-radius: 999px;
}

.quote
{
    font-size: 12px;
    font-weight: 400;

    padding: 20px 0;

    color: rgba(0, 0, 0, .75);
    border-top: 1px solid rgba(0, 0, 0, .1);
    border-bottom: 1px solid rgba(0, 0, 0, .1);
}

section.news-section .container-news
{
    margin: 35px -15px 90px -15px;
}

.container-news
{
    overflow: visible;

    margin: 35px -15px;
}

.container-news .news-item
{
    float: left;

    width: 49%;
    padding: 23px;

    border: 1px solid rgba(51, 51, 51, .25);
    background: #fff;
}

.container-news .news-item p
{
    margin: 0;
}

.container-news .news-item .date
{
    position: relative;

    margin-bottom: 13px;
    padding-top: 10px;
}

.container-news .news-item .date strong
{
    font-size: 11px;
    font-weight: 700;

    display: block;

    padding-top: 10px;

    text-transform: uppercase;
}

.container-news .news-item .date strong:after
{
    position: absolute;
    top: 0;
    left: 0;

    width: 40px;
    height: 3px;

    content: '';

    background: #00aeef;
}

.container-news .news-item .title-news
{
    margin-bottom: 6px;
}

.container-news .news-item .title-news a
{
    display: inline;

    margin: 0;
    padding: 0;

    border: none;
    background: none;
}

.container-news .news-item .title-news h2
{
    font-size: 16px;
    font-weight: 700;

    color: #000;
}

.container-news .news-item .text-news p
{
    font-size: 12px;
    font-weight: 500;

    opacity: .6;
    color: #000;
}

.container-news .news-item:nth-child(2n)
{
    margin-left: 2%;
}

section.line-breadcrumb
{
    padding-left: 100px;

    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
    background: #fff;
}

section.line-breadcrumb .container-header-line
{
    position: relative;

    height: 66px;
}

section.line-breadcrumb .container-header-line a.before
{
    position: absolute;
    z-index: 9;
    top: 0;
    bottom: 0;
    left: 15px;

    display: none;

    width: 10px;
    height: 18px;
    margin: auto;

    background: url('../img/slider-arrow-left.svg') no-repeat;
    background-size: 10px;
}

section.line-breadcrumb .container-header-line a.next
{
    position: absolute;
    z-index: 9;
    top: 0;
    right: 15px;
    bottom: 0;

    display: none;

    width: 10px;
    height: 18px;
    margin: auto;

    background: url('../img/slider-arrow-right.svg') no-repeat;
    background-size: 10px;
}

section.line-breadcrumb .width-large
{
    position: relative;

    padding-right: 25px;
    padding-left: 25px;
}

section.line-breadcrumb .width-large a.next
{
    display: block;
}

section.line-breadcrumb .width-large a.before
{
    display: block;
}

section.line-breadcrumb .width-large:before
{
    position: absolute;
    z-index: 1;
    top: 0;
    left: -10px;

    width: 140px;
    height: 100%;

    content: '';

    background: #fff;
    background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), to(#fff));
    background:     -ms-linear-gradient(left, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background: -webkit-gradient(linear, right top, left top, from(rgba(255, 255, 255, 0)), color-stop(70%, #fff));
    background: -webkit-linear-gradient(right, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background:         linear-gradient(to left, rgba(255, 255, 255, 0) 0%, #fff 70%);

    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='transperent', endColorstr='#fff',GradientType=0 );
}

section.line-breadcrumb .width-large:after
{
    position: absolute;
    z-index: 1;
    top: 0;
    right: -10px;

    width: 140px;
    height: 100%;

    content: '';

    background: #fff;
    background: -webkit-gradient(linear, right top, left top, from(rgba(255, 255, 255, 0)), to(#fff));
    background:     -ms-linear-gradient(right, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background: -webkit-linear-gradient(right, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background: -webkit-gradient(linear, left top, right top, from(rgba(255, 255, 255, 0)), color-stop(70%, #fff));
    background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, #fff 70%);
    background:         linear-gradient(to right, rgba(255, 255, 255, 0) 0%, #fff 70%);

    filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='transperent', endColorstr='#fff',GradientType=0 );
}

section.line-breadcrumb .end-slider:after
{
    display: none;
}

section.line-breadcrumb .end-slider a.next
{
    display: none;
}

section.line-breadcrumb .start-slider:before
{
    display: none;
}

section.line-breadcrumb .start-slider a.before
{
    display: none;
}

section.line-breadcrumb ol.end
{
    right: 25px !important;
    left: auto !important;
}

section.line-breadcrumb .list-categories
{
    position: absolute;
    top: 0;
    left: 0;

    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display:         flex;

    height: 100%;
    margin: 0;

    counter-reset: categories;

    -webkit-box-pack: start;
    -webkit-justify-content: flex-start;
    -ms-flex-pack: start;
            justify-content: flex-start;
    -webkit-flex-wrap: nowrap;
        -ms-flex-wrap: nowrap;
            flex-wrap: nowrap;
}

section.line-breadcrumb .list-categories li
{
    font-size: 12px;
    font-weight: 600;

    position: relative;

    display: inline-block;

    width: auto;
    margin: 6px 15px 0 15px;
    padding-left: 25px;

    counter-increment: categories;
    -webkit-transition: .2s;
            transition: .2s;
    white-space: nowrap;
    text-transform: uppercase;

    color: rgba(0, 0, 0, .5);
    border-bottom: 2px solid transparent;
}

section.line-breadcrumb .list-categories li:after
{
    position: absolute;
    top: 20px;
    left: 0;

    content: counters(categories, '.', decimal-leading-zero) '. ';
}

section.line-breadcrumb .list-categories li a
{
    font-size: 12px;
    font-weight: 600;

    display: block;

    padding: 20px 0;

    -webkit-transition: .2s;
            transition: .2s;
    text-transform: uppercase;

    color: rgba(0, 0, 0, .5);
}

section.line-breadcrumb .list-categories li:hover
{
    color: #000;
}

section.line-breadcrumb .list-categories li:hover a
{
    color: #000;
}

section.line-breadcrumb .list-categories li.active
{
    color: #000;
    border-bottom: 2px solid #000;
}

section.line-breadcrumb .list-categories li.active a
{
    color: #000;
}

.container-details
{
    margin: 30px -30px;
}

.container-details a
{
    margin: 0 0 20px 0 !important;
}

.container-details .item-line
{
    margin-bottom: 20px;
    padding-bottom: 20px;

    border-bottom: 1px solid rgba(51, 51, 51, .25);
}

.container-details .item-line:last-child
{
    margin-bottom: 0;
    padding-bottom: 0;

    border: none;
}

.container-details .item-line a
{
    display: none !important;
}

.container-details .item-line p
{
    font-size: 12px;

    margin-bottom: 4px;

    text-transform: uppercase;

    color: rgba(0, 0, 0, .5);
}

.container-details .item-line h2
{
    font-size: 16px;
    font-weight: 500;

    color: #000;
}

.container-details .table-block
{
    padding: 25px 30px;

    border: 1px solid rgba(51, 51, 51, .25);
    background: #fff;
}

.container-accordion
{
    margin: 20px 0;
}

.container-accordion .item-accordion:last-child
{
    margin-bottom: 0;
}

.container-accordion .item-accordion
{
    margin-bottom: 25px;
    padding: 20px 30px;

    border: 1px solid rgba(51, 51, 51, .25);
    background: #fff;
}

.container-accordion .item-accordion p
{
    margin: 0;
}

.container-accordion .item-accordion .accordion-header
{
    font-size: 16px;
    font-weight: 500;

    position: relative;

    padding: 15px 50px;

    cursor: pointer;

    color: #000;
    background: url('../img/qa.svg') no-repeat left center;
    background-size: 25px;
}

.container-accordion .item-accordion .accordion-header:after
{
    font-size: 20px;
    line-height: 26px;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;

    width: 30px;
    height: 30px;
    margin: auto;

    content: '+';
    -webkit-transition: .2s;
            transition: .2s;
    text-align: center;
    letter-spacing: 0;

    color: #00aeef;
    border: 1px solid #00aeef;
    -webkit-border-radius: 999px;
            border-radius: 999px;
}

.container-accordion .item-accordion .accordion-header.opened
{
    margin-bottom: 10px;
}

.container-accordion .item-accordion .accordion-header.opened:after
{
    font-size: 24px;

    content: '-';
}

.container-accordion .item-accordion .accordion-header:hover:after
{
    color: #fff;
    background: #00aeef;
}

.container-accordion .item-accordion .accordion-body
{
    display: none;

    padding: 0 50px;
}

.container-accordion .item-accordion .accordion-body.opened-body
{
    display: block;
}

.quote p:last-child
{
    margin: 0;
}

section.news
{
    min-height: 710px;
}

section.news .news-item
{
    margin: 0 0 20px 0 !important;
}

section.news .grid-sizer,
section.news .news-item
{
    width: 48%;
}

.container-filters
{
    float: right;

    padding: 15px 0;
}

.container-filters select
{
    font-size: 12px;

    position: relative;

    padding: 10px 35px 10px 25px;

    text-transform: uppercase;

    color: #000;
    border: none;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    background: #fff;

    -webkit-appearance: none;
}

.container-filters .select
{
    position: relative;

    float: left;

    margin-right: 20px;
}

.container-filters .select:last-child
{
    margin-right: 0;
}

.container-filters .select:after
{
    position: absolute;
    top: 16px;
    right: 10px;

    display: block;

    width: 6px;
    height: 4px;

    content: '';

    background: url('../img/icon-arrow-select.png') no-repeat;
}

button.button-more,
#mse2_mfilter button.btn_more,
button.btn_more
{
    font-size: 13px;
    font-weight: 500;

    padding: 10px 14px;

    cursor: pointer;
    -webkit-transition: .3s;
            transition: .3s;

    color: rgba(0, 0, 0, .6);
    border: 1px solid rgba(0, 0, 0, .6);
    -webkit-border-radius: 4px;
            border-radius: 4px;
    background: none;
}

button.button-more:hover,
#mse2_mfilter button.btn_more:hover,
button.btn_more:hover
{
    color: #fff;
    background: #000;
}

section.licenses
{
    min-height: 710px;
    padding: 40px 0;

    background: #f8f8f8;
}

.large-text-section
{
    margin-bottom: 15px;
}

.large-text-section strong
{
    font-size: 16px;
    font-weight: 500;

    position: relative;

    display: block;

    padding-top: 10px;

    color: #000;
}

.large-text-section strong:before
{
    position: absolute;
    top: 0;
    left: 0;

    width: 40px;
    height: 3px;

    content: '';

    background: #00aeef;
}

.container-licenses
{
    margin-bottom: 30px;
}

.container-licenses .item-license,
.container-licenses .grid-sizer-license
{
    width: 48.8%;
}

.container-licenses .item-license
{
    margin-bottom: 20px;
    padding: 25px 25px 25px 80px;

    border: 1px solid rgba(51, 51, 51, .25);
    background: url('../img/icon-doc.png') no-repeat left 25px top 30px, #fff;
}

.container-licenses .item-license a
{
    font-size: 16px;
    font-weight: 600;

    display: block;

    margin: 0 0 10px 0 !important;
    padding: 0 !important;

    color: #000;
    border: none !important;
    background: none !important;
}

.container-licenses .item-license span.info,
.container-licenses .item-license span.info p
{
    font-size: 12px;
    font-weight: 500;

    display: block;

    margin-bottom: 5px;

    color: #000;
}

.container-licenses .item-license span.timeout,
.container-licenses .item-license span.timeout p
{
    font-size: 12px;

    display: block;

    margin-bottom: 5px;

    color: #00aeef;
}

.container-licenses .item-license span.info-bottom,
.container-licenses .item-license span.info-bottom p
{
    font-size: 12px;
    font-weight: 500;

    display: block;

    color: rgba(0, 0, 0, .5);
}

section.ranking
{
    padding: 40px 0;

    background: #f8f8f8;
}

.large-text-section span
{
    font-size: 16px;
    font-weight: 600;

    color: rgba(0, 0, 0, .5);
}

.table-ranking
{
    margin: 15px -30px;
}

.table-ranking table
{
    overflow: hidden;

    width: 100%;
    margin: 15px 0 35px 0;

    border-collapse: collapse;

    background: #fff;
    -webkit-box-shadow: 1px 0 10px rgba(0, 0, 0, .15);
            box-shadow: 1px 0 10px rgba(0, 0, 0, .15);
}

.table-ranking table thead
{
    width: 100%;

    color: #fff;
}

.table-ranking table thead tr td
{
    font-size: 11px;
    font-weight: 700;

    padding: 15px;

    text-transform: uppercase;

    background: #666;
}

.table-ranking table thead tr td:first-child
{
    -webkit-border-radius: 5px 0 0 0;
            border-radius: 5px 0 0 0;
}

.table-ranking table thead tr td:last-child
{
    -webkit-border-radius: 0 5px 0 0;
            border-radius: 0 5px 0 0;
}

.table-ranking table tbody tr td
{
    font-size: 11px;
    font-weight: 500;

    padding: 15px;

    color: #000;
}

.table-ranking table tbody tr:nth-child(2n)
{
    background: #efefef;
}

.table-ranking table tbody tr:last-child td:first-child
{
    -webkit-border-radius: 0 0 5px 0;
            border-radius: 0 0 5px 0;
}

.table-ranking table tbody tr:last-child td:last-child
{
    -webkit-border-radius: 0 0 0 5px;
            border-radius: 0 0 0 5px;
}

.table-ranking table tbody tr.bold
{
    border-top: 2px solid #666;
    background: #fff;
}

.table-ranking table tbody tr.bold td
{
    font-weight: 700;
}

*
{
    font-family: 'Lato', Helvetica, Arial, sans-serif;

    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    margin: 0;
    padding: 0;

    outline: none;

    font-variant-numeric: lining-nums;
    -webkit-font-feature-settings: 'lnum';
            font-feature-settings: 'lnum';
}

#jGrowl
{
    display: none !important;
}

div,
header
{
    display: block;
    overflow: hidden;
}

a
{
    text-decoration: none;
}

a:hover
{
    text-decoration: none;
}

h1,
h2,
h3,
h4
{
    margin: 0;
}

button
{
    border: none;
}

*::-webkit-input-placeholder
{
    color: #000;
}

*:-moz-placeholder
{
    color: #000;
}

*::-moz-placeholder
{
    color: #000;
}

*:-ms-input-placeholder
{
    color: #000;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button
{
    margin: 0;
    /* display: none; <- Crashes Chrome on hover */

    -webkit-appearance: none;
}

body
{
    font-size: 16px;

    position: relative;

    min-width: 320px;
}

ul
{
    margin: 0;

    list-style: none;
}

section
{
    overflow: hidden;
}

#wrapper
{
    min-height: -webkit-calc(100vh - 57px);
    min-height:         calc(100vh - 57px);
}

#wrapper.sub
{
    background: #f8f8f8;
}

body.mobile header
{
    display: none;
}

body.mobile .container
{
    margin-left: auto;
}

body.mobile .mobile-header
{
    display: block;
}

body.mobile #wrapper
{
    padding-top: 46px;
}

body.mobile footer
{
    margin-left: 0;
}

body.mobile section.line-breadcrumb
{
    padding-left: 0;
}

section.auth
{
    height: 100vh;

    background: #333;
}

section.auth .container
{
    position: relative;

    height: 100%;
}

.block-auth
{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    max-width: 450px;
    height: 350px;
    margin: auto;
    padding: 35px;

    color: #000;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    background: #fff;
    -webkit-box-shadow: 8px 0 18px rgba(0, 0, 0, .25);
            box-shadow: 8px 0 18px rgba(0, 0, 0, .25);
}

.block-auth strong
{
    font-size: 12px;
    font-weight: 700;

    display: block;

    text-transform: uppercase;
}

.block-auth h1
{
    font-size: 29px;
    font-weight: 600;

    display: block;

    margin-bottom: 25px;
}

.block-auth input
{
    font-size: 12px;

    width: 100%;
    height: 46px;
    margin-bottom: 23px;
    padding: 0 15px;

    color: #000;
    border: none;
    background: #f2f2f2;
}

.block-auth *::-webkit-input-placeholder
{
    color: rgba(0, 0, 0, .6);
}

.block-auth *:-moz-placeholder
{
    color: rgba(0, 0, 0, .6);
}

.block-auth *::-moz-placeholder
{
    color: rgba(0, 0, 0, .6);
}

.block-auth *:-ms-input-placeholder
{
    color: rgba(0, 0, 0, .6);
}

.block-auth button
{
    font-size: 12px;
    font-weight: 400;

    padding: 10px 35px;

    cursor: pointer;
    -webkit-transition: .3s;
            transition: .3s;

    color: #000;
    border: 1px solid #000;
    -webkit-border-radius: 4px;
            border-radius: 4px;
    background: none;
}

.block-auth button:hover
{
    color: #fff;
    background: #000;
}

.block_form_popup
{
    position: relative;
}

#form_open
{
    position: relative;

    max-width: 450px;
    margin: auto;
}

@media (min-width: 576px)
{
    #menu-mobile li.level1 a
    {
        padding-right: 15px;
        padding-left: 15px;
    }

    #menu-mobile li.level1 a
    {
        width: 540px;
        max-width: 100%;
    }
}

@media (min-width: 768px)
{
    #menu-mobile li.level1 a
    {
        padding-right: 15px;
        padding-left: 15px;
    }

    #menu-mobile li.level1 a
    {
        width: 720px;
        max-width: 100%;
    }
}

@media (min-width: 992px)
{
    #menu-mobile li.level1 a
    {
        padding-right: 15px;
        padding-left: 15px;
    }

    #menu-mobile li.level1 a
    {
        width: 960px;
        max-width: 100%;
    }
}

@media only screen and (min-width: 992px)
{
    footer
    {
        margin-left: 80px;
    }
}

@media (min-width: 1200px)
{
    #menu-mobile li.level1 a
    {
        padding-right: 15px;
        padding-left: 15px;
    }

    #menu-mobile li.level1 a
    {
        width: 1140px;
        max-width: 100%;
    }
}

@media only screen and (max-width: 1200px) and (min-width: 992px)
{
    .container,
    #menu-mobile li.level1 a
    {
        width: 850px !important;
    }
}

@media only screen and (max-width: 1400px) and (min-width: 992px)
{
    .container
    {
        width: 1000px;
        margin-left: 150px;
    }

    #menu-mobile li.level1 a
    {
        width: 1000px;
    }
}

@media only screen and (min-width: 2000px)
{
    section.exchange
    {
        padding: 65px 0 400px 0;
    }
}

@media only screen and (max-width: 1200px)
{
    section.about-main .title-section
    {
        margin-top: 15px;
    }

    section.about-main .title-section h2
    {
        font-size: 30px;
        font-weight: 300;
        line-height: normal;
    }

    .title-main h1
    {
        font-size: 35px;
    }

    section.exchange .title-section-exchange h2
    {
        font-size: 30px;
        line-height: normal;
    }
}

@media only screen and (max-width: 992px)
{
    #wrapper
    {
        padding-top: 46px;
    }

    header
    {
        display: none;
    }

    .mobile-header
    {
        display: block;
    }

    section.main-screen
    {
        height: auto;
        padding: 150px 0;
    }

    section.main-screen .container .col-lg-12
    {
        position: relative;

        height: auto;
        margin-top: 0;
    }

    section.about-main .container-features
    {
        -webkit-flex-wrap: wrap;
            -ms-flex-wrap: wrap;
                flex-wrap: wrap;
    }

    section.about-main .container-features .container-item-feature
    {
        width: 50%;
        margin-bottom: 20px;
        padding: 0 15px;
    }

    section.about-main .container-features .container-item-feature:last-child
    {
        padding: 0;
    }

    footer .planb
    {
        display: none;
    }

    section.exchange
    {
        padding: 65px 0;
    }

    section.exchange .small-text-section
    {
        margin-bottom: 15px;
    }

    section.exchange .container-cards .item-card
    {
        display: inline-block;
    }

    section.exchange .container-cards .item-card:first-child
    {
        margin-right: 20px;
    }

    .container-accordion .item-accordion .accordion-header
    {
        font-size: 11px;
    }

    .container-accordion .item-accordion .accordion-body
    {
        padding: 0;
    }

    .container-details
    {
        margin: 30px -30px;
    }

    .container-details a
    {
        margin: 20px 0 !important;
    }

    section.line-breadcrumb
    {
        padding-left: 0;
    }

    section.line-breadcrumb .container-header-line
    {
        overflow: scroll;
        overflow-y: hidden;

        height: 48px;
    }

    section.line-breadcrumb .list-categories
    {
        padding: 0 30px;
    }

    section.line-breadcrumb .list-categories li
    {
        margin: 0 15px 0 0;

        border: none !important;
    }

    section.line-breadcrumb .list-categories li:after
    {
        top: 15px;
    }

    section.line-breadcrumb .list-categories li a
    {
        padding: 15px 0 0 0;
    }

    section.line-breadcrumb .list-categories li:last-child a
    {
        padding: 15px 0;
    }

    section.detail img.small
    {
        width: 100%;
        margin-bottom: 15px;
    }

    .container-table,
    .table-ranking
    {
        overflow: scroll;
        overflow-y: hidden;
    }

    section.news
    {
        min-height: inherit;
    }

    section.news .grid-sizer,
    section.news .news-item
    {
        width: 100%;
    }

    .container-filters
    {
        float: none;
    }

    section.licenses
    {
        min-height: inherit;
    }

    .container-licenses .item-license,
    .container-licenses .grid-sizer-license
    {
        width: 100%;
    }

    section.ranking
    {
        min-height: inherit;
    }

    #wrapper
    {
        padding-top: 46px;
    }

    section.auth
    {
        padding: 60px 0;
    }

    section.auth .container
    {
        height: auto;
    }

    section.auth .block-auth
    {
        position: relative;
    }
}

@media only screen and (max-width: 768px)
{
    footer ul.menu-footer
    {
        display: none;
    }

    section.exchange .title-section-exchange h2
    {
        font-size: 22px;
    }

    section.exchange .container-cards .item-card
    {
        width: 140px;
    }

    section.exchange .container-cards .item-card a.url
    {
        font-size: 8px;

        margin-top: 20px;
    }

    section.exchange .container-cards .item-card .logo
    {
        width: 30px;
    }

    section.exchange .text-section p
    {
        font-size: 14px;
        line-height: 1.5;
    }

    section.about-main .container-features .item-feature
    {
        opacity: 1 !important;
    }

    section.about-main .container-features .container-item-feature
    {
        width: 100%;
        margin-bottom: 25px;
        padding: 0;
    }

    section.about-main .container-features .container-item-feature .line
    {
        width: 100%;
    }

    section.about-main .container-features .container-item-feature:last-child
    {
        padding: 0;
    }

    section.about-main .text-section p
    {
        font-size: 14px;
        line-height: 1.5;
    }

    section.about-main .title-section h2
    {
        font-size: 22px;
    }

    footer
    {
        padding: 15px;
    }

    footer .logo-name
    {
        font-size: 10px;
    }

    .title-main h1
    {
        font-size: 28px;
        line-height: 1.5;
    }

    .container-buttons-main-screen a.button-string
    {
        display: none;
    }

    section.header .title-header h1
    {
        font-size: 22px;
        line-height: 1.2;
    }

    section.detail a
    {
        padding: 65px 15px 25px 15px;

        background-position: left 15px top 10px;
    }

    section.detail a span.title
    {
        font-size: 14px;
    }

    section.detail .container-blocks div
    {
        width: 100%;
        margin: 0 0 20px 0;
    }

    section.detail .container-blocks div:nth-child(2n)
    {
        margin-left: 0;
    }

    .container-news .news-item
    {
        width: 100%;
        margin-bottom: 20px;
    }

    .container-news .news-item:nth-child(2n)
    {
        margin-left: 0;
    }
}

@media only screen and (max-width: 600px)
{
    .container-licenses .item-license
    {
        padding: 65px 15px 25px 15px;

        background-position: left 15px top 10px;
    }

    .container-licenses .item-license a
    {
        font-size: 14px;
    }
}

@media only screen and (max-width: 480px)
{
    section.detail h1,
    section.detail section.detail p h1
    {
        font-size: 24px;
        line-height: 1.2;
    }

    section.detail p
    {
        font-size: 14px;
    }

    .container-filters .select
    {
        float: none;

        width: 100%;
        margin-bottom: 10px;
    }

    .container-filters .select select
    {
        width: 100%;
    }

    .container-filters .select:last-child
    {
        margin-bottom: 0;
    }

    section.auth .block-auth h1
    {
        font-size: 24px;
    }
}

@media only screen and (max-width: 345px)
{
    section.exchange .container-cards .item-card:first-child
    {
        margin-right: 4px;
    }
}

@media only screen and (max-height: 650px)
{
    header .languages
    {
        opacity: 0;
    }

    header .languages
    {
        opacity: 0;
    }
}

@media only screen and (max-height: 600px)
{
    .languages
    {
        opacity: 0;
    }
}

        `}</style>
    </div>
    );
  }
}

function mapStateToProps(state) {
  return {
  	user: state.user,
    processes: state.processes
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({
  	checkUser: actions.checkUser,
    tryLoginAgain: actions.tryLoginAgain
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);