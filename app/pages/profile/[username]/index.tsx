import { NextPage } from 'next';
import Layout from '../../../components/layout';

const ProfilePage: NextPage = () => {
	return (
		<>
			<Layout>
				<div className="profile-page">
					<div className="user-info">
						<div className="container">
							<div className="row">
								<div className="col-xs-12 col-md-10 offset-md-1">
									<img src="http://i.imgur.com/Qr71crq.jpg" className="user-img" />
									<h4>Eric Simons</h4>
									<p>Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games</p>
									<button className="btn btn-sm btn-outline-secondary action-btn">
										<i className="ion-plus-round"></i>
										&nbsp; Follow Eric Simons
									</button>
								</div>
							</div>
						</div>
					</div>

					<div className="container">
						<div className="row">
							<div className="col-xs-12 col-md-10 offset-md-1">
								<div className="articles-toggle">
									<ul className="nav nav-pills outline-active">
										<li className="nav-item">
											<a className="nav-link active" href="">
												My Articles
											</a>
										</li>
										<li className="nav-item">
											<a className="nav-link" href="">
												Favorited Articles
											</a>
										</li>
									</ul>
								</div>

								<div className="article-preview">
									<div className="article-meta">
										<a href="">
											<img src="http://i.imgur.com/Qr71crq.jpg" />
										</a>
										<div className="info">
											<a href="" className="author">
												Eric Simons
											</a>
											<span className="date">January 20th</span>
										</div>
										<button className="btn btn-outline-primary btn-sm pull-xs-right">
											<i className="ion-heart"></i> 29
										</button>
									</div>
									<a href="" className="preview-link">
										<h1>How to build webapps that scale</h1>
										<p>This is the description for the post.</p>
										<span>Read more...</span>
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};
export default ProfilePage;
