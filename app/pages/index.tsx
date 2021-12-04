import { useWeb3React } from '@web3-react/core';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import ArticlePreview from '../components/article-preview';
import Layout from '../components/layout';
import contract from '../../artifacts/contracts/Realworld.sol/Realworld.json';
import { ethers } from 'ethers';

const HomePage: NextPage = () => {
	const web3React = useWeb3React();
	const [articles, setArticles] = useState([]);
	const [isFetchingArticles, setIsFetchingArticles] = useState(false);
	const getArticles = async () => {
		setIsFetchingArticles(true);
		const realworldContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, contract.abi, web3React.library?.getSigner());
		const articles = await realworldContract.getArticles();
		setArticles(
			articles.map((data: { article: { id: number; title: string; slug: string; description: string; body: string; createdAt: number }; tags: []; favoritedByUsers: []; createdBy: { user: { id: string; name: string; image: string; bio: string } } }) => {
				return {
					id: data.article.id,
					title: data.article.title,
					description: data.article.description,
					body: data.article.body,
					tags: data.tags,
					createdAt: new Date(data.article.createdAt * 1000),
					slug: data.article.slug,
					createdBy: {
						id: data.createdBy.user.id,
						name: data.createdBy.user.name,
						image: data.createdBy.user.image,
						bio: data.createdBy.user.bio,
					},
				};
			})
		);
		setIsFetchingArticles(false);
	};
	useEffect(() => {
		if (!web3React.active) return;
		getArticles();
	}, [web3React.active]);
	return (
		<>
			<Layout>
				<div className="home-page">
					<div className="banner">
						<div className="container">
							<h1 className="logo-font">conduit</h1>
							<p>A place to share your knowledge.</p>
						</div>
					</div>

					<div className="container page">
						<div className="row">
							<div className="col-md-9">
								<div className="feed-toggle">
									<ul className="nav nav-pills outline-active">
										<li className="nav-item">
											<a className="nav-link disabled" href="">
												Your Feed
											</a>
										</li>
										<li className="nav-item">
											<a className="nav-link active" href="">
												Global Feed
											</a>
										</li>
									</ul>
								</div>
								{isFetchingArticles && <p>Loading articles...</p>}
								{!isFetchingArticles && (
									<>
										{articles.length == 0 && <>empty</>}
										{articles.length > 0 &&
											articles.map((article: { id: any }, index) => {
												return (
													<>
														<ArticlePreview key={index} data={article} />;
													</>
												);
											})}
									</>
								)}
							</div>

							<div className="col-md-3">
								<div className="sidebar">
									<p>Popular Tags</p>

									<div className="tag-list">
										<a href="" className="tag-pill tag-default">
											programming
										</a>
										<a href="" className="tag-pill tag-default">
											javascript
										</a>
										<a href="" className="tag-pill tag-default">
											emberjs
										</a>
										<a href="" className="tag-pill tag-default">
											angularjs
										</a>
										<a href="" className="tag-pill tag-default">
											react
										</a>
										<a href="" className="tag-pill tag-default">
											mean
										</a>
										<a href="" className="tag-pill tag-default">
											node
										</a>
										<a href="" className="tag-pill tag-default">
											rails
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</>
	);
};

export default HomePage;
