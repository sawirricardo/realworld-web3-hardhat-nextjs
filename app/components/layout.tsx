import { useWeb3React } from '@web3-react/core';
import { InjectedConnector, NoEthereumProviderError, UserRejectedRequestError } from '@web3-react/injected-connector';
import { NextComponentType } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
const Layout: NextComponentType = ({ children }) => {
	const web3React = useWeb3React();

	const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
	useEffect(() => {
		injected.isAuthorized().then((isAuthorized) => {
			if (isAuthorized) web3React.activate(injected);
		});
	}, []);
	const isNoEthereumProviderError = web3React.error instanceof NoEthereumProviderError;
	const isUserRejectedRequestError = web3React.error instanceof UserRejectedRequestError;
	return (
		<>
			<Head>
				<title>Conduit</title>
				<link href="//code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" rel="stylesheet" type="text/css" />
				<link href="//fonts.googleapis.com/css?family=Titillium+Web:700|Source+Serif+Pro:400,700|Merriweather+Sans:400,700|Source+Sans+Pro:400,300,600,700,300italic,400italic,600italic,700italic" rel="stylesheet" type="text/css" />
				<link rel="stylesheet" href="//demo.productionready.io/main.css" />
			</Head>
			{web3React.account && (
				<div style={{ padding: '1rem', backgroundColor: 'yellow', textAlign: 'center' }}>
					<h6>Connected to network: {web3React.chainId}</h6>
				</div>
			)}
			<nav className="navbar navbar-light">
				<div className="container">
					<Link href="/">
						<a className="navbar-brand">conduit</a>
					</Link>
					<ul className="nav navbar-nav pull-xs-right">
						<li className="nav-item">
							{/* <!-- Add "active" className when you're on that page" --> */}
							<Link href="/">
								<a className="nav-link active">Home</a>
							</Link>
						</li>
						{web3React.account && (
							<>
								<li className="nav-item">
									<Link href="/articles/create">
										<a className="nav-link">
											<i className="ion-compose"></i>&nbsp;New Article
										</a>
									</Link>
								</li>
								<li className="nav-item">
									<Link href="/settings">
										<a className="nav-link">
											<i className="ion-gear-a"></i>&nbsp;Settings
										</a>
									</Link>
								</li>
								<li className="nav-item">
									<a className="nav-link" onClick={() => web3React.deactivate()}>
										Disconnect wallet
									</a>
								</li>
							</>
						)}
						{!web3React.account && (
							<li className="nav-item">
								<a className="nav-link" onClick={() => web3React.activate(injected)}>
									Continue with wallet
								</a>
							</li>
						)}
					</ul>
				</div>
			</nav>
			{children}
			<footer>
				<div className="container">
					<a href="/" className="logo-font">
						conduit
					</a>
					<span className="attribution">
						An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
					</span>
				</div>
			</footer>
		</>
	);
};
export default Layout;
