import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';

const SettingsPage: NextPage = () => {
	const router = useRouter();
	const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
	useEffect(() => {
		injected.isAuthorized().then((isAuthorized) => {
			!isAuthorized && router.push('/');
		});
	}, []);

	return (
		<>
			<Layout>
				<div className="settings-page">
					<div className="container page">
						<div className="row">
							<div className="col-md-6 offset-md-3 col-xs-12">
								<h1 className="text-xs-center">Your Settings</h1>

								<form>
									<fieldset>
										<fieldset className="form-group">
											<input className="form-control" type="text" placeholder="URL of profile picture" />
										</fieldset>
										<fieldset className="form-group">
											<input className="form-control form-control-lg" type="text" placeholder="Your Name" />
										</fieldset>
										<fieldset className="form-group">
											<textarea className="form-control form-control-lg" rows={8} placeholder="Short bio about you"></textarea>
										</fieldset>
										<fieldset className="form-group">
											<input className="form-control form-control-lg" type="text" placeholder="Email" />
										</fieldset>
										<fieldset className="form-group">
											<input className="form-control form-control-lg" type="password" placeholder="Password" />
										</fieldset>
										<button className="btn btn-lg btn-primary pull-xs-right">Update Settings</button>
									</fieldset>
								</form>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default SettingsPage;
