import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';

describe('realworld', () => {
	it('can create a post', async () => {
		const Realworld = await ethers.getContractFactory('Realworld');
		const realworld = await Realworld.deploy();
		await realworld.deployed();
		const now = Date.now() / 1000;
		const postTx = await realworld.createArticle(`Hello World`, `hello-world`, `description`, `x`.repeat(1000), []);
		await postTx.wait();

		expect(await realworld.getArticlesCount()).to.eq(1);

		const { article } = await realworld.getArticle(0);
		expect(article.title).to.eq('Hello World');
		expect(article.slug).to.eq('hello-world');
		expect(article.description).to.eq('description');
		expect(article.body).to.eq('x'.repeat(1000));
	});

	it(`can create tags`, async () => {
		const Realworld = await ethers.getContractFactory('Realworld');
		const realworld = await Realworld.deploy();
		await realworld.deployed();

		let tagTx = await realworld.createTag(`Programming`);
		await tagTx.wait();
		expect((await realworld.getTags()).length).to.eq(1);

		tagTx = await realworld.createTag(`JavaScript`);
		await tagTx.wait();
		expect((await realworld.getTags()).length).to.eq(2);

		let tags = await realworld.getTags();
		expect(tags[0]).to.eq(`Programming`);
		expect(tags[1]).to.eq(`JavaScript`);
	});
});
