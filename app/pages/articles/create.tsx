import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { ethers } from 'ethers';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Layout from '../../components/layout';
import contract from '../../../artifacts/contracts/Realworld.sol/Realworld.json';
import { useRouter } from 'next/dist/client/router';

type FormData = {
	title: string;
	description: string;
	body: string;
};
const ArticleCreatePage: NextPage = () => {
	const [isCreatingArticle, setIsCreatingArticle] = useState(false);
	const [errorCreating, setErrorCreating] = useState('');
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<FormData>();
	const router = useRouter();
	const web3React = useWeb3React();
	const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] });
	const onSubmit = async (data: FormData) => {
		const realworldContract = new ethers.Contract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, contract.abi, web3React.library.getSigner());
		setIsCreatingArticle(true);
		try {
			const articleTx = await realworldContract.createArticle(data.title, slugify(data.title), data.description, data.body, []);
			await articleTx.wait();
			router.push('/');
		} catch (error: any) {
			setErrorCreating(error.message);
		}
		setIsCreatingArticle(false);
	};
	const slugify = (...args: (string | number)[]): string => {
		const value = args.join(' ');

		return value
			.normalize('NFD') // split an accented letter in the base letter and the acent
			.replace(/[\u0300-\u036f]/g, '') // remove all previously split accents
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9 ]/g, '') // remove all chars not letters, numbers and spaces (to be replaced)
			.replace(/\s+/g, '-'); // separator
	};
	useEffect(() => {
		if (!web3React.active) {
			injected.isAuthorized().then((isAuthorized) => {
				if (isAuthorized) web3React.activate(injected);
			});
		}
	}, [web3React.active]);

	return (
		<>
			<Layout>
				<div className="editor-page">
					<div className="container page">
						<div className="row">
							<div className="col-md-10 offset-md-1 col-xs-12">
								{errorCreating != '' && <div className="alert alert-danger">{errorCreating}</div>}
								{isCreatingArticle && <div className="alert alert-info">Creating article...</div>}

								<form onSubmit={handleSubmit(onSubmit)}>
									<fieldset>
										<fieldset className="form-group">
											<input type="text" className="form-control form-control-lg" placeholder="Article Title" {...register('title', { required: true })} />
											{errors.title && <span className="text-danger">This field is required</span>}
										</fieldset>
										<fieldset className="form-group">
											<input type="text" className="form-control" placeholder="What's this article about?" {...register('description')} />
										</fieldset>
										<fieldset className="form-group">
											<textarea className="form-control" rows={8} placeholder="Write your article (in markdown)" {...register('body', { required: true })}></textarea>
											{errors.body && <span className="text-danger">This field is required</span>}
										</fieldset>
										{/* <fieldset className="form-group">
											<input type="text" className="form-control" placeholder="Enter tags" />
											<div className="tag-list"></div>
										</fieldset> */}
										<button className="btn btn-lg pull-xs-right btn-primary">Publish Article</button>
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

export default ArticleCreatePage;
