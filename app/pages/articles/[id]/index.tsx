import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { NextPage } from 'next';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/layout';
import contract from '../../../../artifacts/contracts/Realworld.sol/Realworld.json';

type ArticleData = {
	id: number;
	title: string;
	slug: string;
	description: string | '';
	body: string;
	tags: string[] | undefined | null;
	createdAt: number;
	createdBy: {
		id: string;
		name: string | '';
		image: string | '';
		bio: string | '';
	};
};
const ArticleShowPage: NextPage = () => {
	const web3React = useWeb3React();
	const router = useRouter();
	const [article, setArticle] = useState<ArticleData>({
		id: 0,
		title: 'article.title',
		description: 'article.description',
		body: 'article.body',
		createdAt: 0,
		slug: 'article.slug',
		tags: ['article.tags'],
		createdBy: {
			id: 'createdBy.user.id',
			name: 'createdBy.user.name',
			image: 'createdBy.user.image',
			bio: 'createdBy.user.bio',
		},
	});
	const [isFetchingArticle, setIsFetchingArticle] = useState(true);
	const getArticle = async () => {
		const { id } = router.query;
		const realworldContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, contract.abi, web3React.library.getSigner());
		try {
			const { article, createdBy } = await realworldContract.getArticleBySlug(id);
			setArticle({
				id: article.id.toNumber(),
				title: article.title,
				description: article.description,
				body: article.body,
				createdAt: article.createdAt.toNumber(),
				slug: article.slug,
				tags: article.tags,
				createdBy: {
					id: createdBy.user.id,
					name: createdBy.user.name,
					image: createdBy.user.image,
					bio: createdBy.user.bio,
				},
			});
		} catch (error) {
			console.error(error);
		}
		setIsFetchingArticle(false);
		console.log(article);
	};
	useEffect(() => {
		if (!web3React.active) return;
		getArticle();
	}, [web3React.active]);
	if (isFetchingArticle) return <Layout>Loading...</Layout>;
	return (
		<>
			<Layout>
				<div className="article-page">
					<div className="banner">
						<div className="container">
							<h1>{article?.title}</h1>

							<div className="article-meta">
								<a href="">
									<img src="http://i.imgur.com/Qr71crq.jpg" />
								</a>
								<div className="info">
									<a href="" className="author">
										{article?.createdBy.name}
										{article?.createdBy.name == '' && article?.createdBy.id}
									</a>
									<span className="date">{article?.createdAt}</span>
								</div>
								<button className="btn btn-sm btn-outline-secondary">
									<i className="ion-plus-round"></i>
									&nbsp; Follow {article?.createdBy.name}
									{article?.createdBy.name == '' && article?.createdBy.id}
									<span className="counter">(10)</span>
								</button>
								&nbsp;&nbsp;
								<button className="btn btn-sm btn-outline-primary">
									<i className="ion-heart"></i>
									&nbsp; Favorite Post <span className="counter">(29)</span>
								</button>
							</div>
						</div>
					</div>

					<div className="container page">
						<div className="row article-content">
							<div className="col-md-12">{article?.body}</div>
						</div>

						<hr />

						<div className="article-actions">
							<div className="article-meta">
								<a href="profile.html">
									<img src="http://i.imgur.com/Qr71crq.jpg" />
								</a>
								<div className="info">
									<a href="" className="author">
										Eric Simons
									</a>
									<span className="date">January 20th</span>
								</div>
								<button className="btn btn-sm btn-outline-secondary">
									<i className="ion-plus-round"></i>
									&nbsp; Follow Eric Simons
								</button>
								&nbsp;
								<button className="btn btn-sm btn-outline-primary">
									<i className="ion-heart"></i>
									&nbsp; Favorite Post <span className="counter">(29)</span>
								</button>
							</div>
						</div>

						<div className="row">
							<div className="col-xs-12 col-md-8 offset-md-2">
								<form className="card comment-form">
									<div className="card-block">
										<textarea className="form-control" placeholder="Write a comment..." rows={3}></textarea>
									</div>
									<div className="card-footer">
										<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										<button className="btn btn-sm btn-primary">Post Comment</button>
									</div>
								</form>

								<div className="card">
									<div className="card-block">
										<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									</div>
									<div className="card-footer">
										<a href="" className="comment-author">
											<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										</a>
										&nbsp;
										<a href="" className="comment-author">
											Jacob Schmidt
										</a>
										<span className="date-posted">Dec 29th</span>
									</div>
								</div>

								<div className="card">
									<div className="card-block">
										<p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
									</div>
									<div className="card-footer">
										<a href="" className="comment-author">
											<img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
										</a>
										&nbsp;
										<a href="" className="comment-author">
											Jacob Schmidt
										</a>
										<span className="date-posted">Dec 29th</span>
										<span className="mod-options">
											<i className="ion-edit"></i>
											<i className="ion-trash-a"></i>
										</span>
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
export default ArticleShowPage;
