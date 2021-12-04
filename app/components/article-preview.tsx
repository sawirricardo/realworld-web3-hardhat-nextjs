import { NextComponentType } from 'next';
import Link from 'next/link';
const ArticlePreview = ({ data }: any) => {
	console.log(data);
	return (
		<>
			<div className="article-preview">
				<div className="article-meta">
					<a href="">
						<img src="http://i.imgur.com/N4VcUeJ.jpg" />
					</a>
					<div className="info">
						<Link href={`/profile/${data.createdBy.id}`}>
							<a className="author">
								{data.createdBy.name == '' && data.createdBy.id}
								{data.createdBy.name}
							</a>
						</Link>
						<span className="date">January 20th</span>
					</div>
					<button className="btn btn-outline-primary btn-sm pull-xs-right">
						<i className="ion-heart"></i> 32
					</button>
				</div>
				<Link href={`/articles/${data.slug}`}>
					<a className="preview-link">
						<h1>{data.title}</h1>
						<p>{data.description}</p>
						<span>Read more...</span>
						<ul className="tag-list">
							<li className="tag-default tag-pill tag-outline">Music</li>
							<li className="tag-default tag-pill tag-outline">Song</li>
						</ul>
					</a>
				</Link>
			</div>
		</>
	);
};
interface Props {
	data: any;
}
export default ArticlePreview;
