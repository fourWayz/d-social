const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SocialMedia Contract', function () {
  let socialMedia;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    const SocialMedia = await ethers.getContractFactory('SocialMedia');
    socialMedia = await SocialMedia.deploy();
    await socialMedia.deployed();
  });

  it('should register a user', async function () {
    const username = 'user1';

    await socialMedia.connect(user1).registerUser(username);
    const user = await socialMedia.users(user1.address);

    expect(user.username).to.equal(username);
    expect(user.userAddress).to.equal(user1.address);
    expect(user.isRegistered).to.be.true;

    const events = await socialMedia.queryFilter('UserRegistered');
    expect(events.length).to.equal(1);
    expect(events[0].args.userAddress).to.equal(user1.address);
    expect(events[0].args.username).to.equal(username);
  });

  it('should create a post', async function () {
    const content = 'This is a test post';

    await socialMedia.connect(user1).registerUser('user1');
    await socialMedia.connect(user1).createPost(content);

    const postsCount = await socialMedia.getPostsCount();
    expect(postsCount).to.equal(1);

    const post = await socialMedia.getPost(0);
    expect(post.author).to.equal(user1.address);
    expect(post.content).to.equal(content);
    expect(post.likes).to.equal(0);
    expect(post.commentsCount).to.equal(0);

    const events = await socialMedia.queryFilter('PostCreated');
    expect(events.length).to.equal(1);
    expect(events[0].args.author).to.equal(user1.address);
    expect(events[0].args.content).to.equal(content);
  });

  // Add more tests for other functions

});
