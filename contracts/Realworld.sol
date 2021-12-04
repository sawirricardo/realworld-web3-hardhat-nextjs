// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Realworld {
    struct Article {
        uint256 id;
        string title;
        string slug;
        string description;
        string body;
        address user;
        uint256 createdAt;
    }
    struct ArticleResource {
        Article article;
        string[] tags;
        address[] favoritedByUsers;
        UserResource createdBy;
        Comment[] comments;
    }
    uint256 public articlesCount = 0;
    mapping(uint256 => Article) public articles;
    mapping(string => uint256) public articleSlugs;

    struct Comment {
        uint256 id;
        uint256 articleId;
        string body;
        address user;
        uint256 createdAt;
        uint256 deletedAt;
    }
    uint256 public commentsCount = 0;
    mapping(uint256 => Comment) public comments;

    string[] public tags;
    struct ArticleTag {
        uint256 articleId;
        uint256 tagId;
    }
    uint256 public articleTagsCount = 0;
    mapping(uint256 => ArticleTag) public articleTags;

    struct ArticleFavorite {
        uint256 articleId;
        address user;
        uint256 unfavoritedAt;
    }
    uint256 public articleFavoritesCount = 0;
    mapping(uint256 => ArticleFavorite) public articleFavorites;

    struct User {
        address id;
        string name;
        string bio;
        string image;
    }
    struct UserResource {
        User user;
        User[] following;
        User[] followedBy;
    }
    mapping(address => User) public users;

    struct UserFollower {
        address user;
        address followedBy;
        uint256 unfollowedAt;
    }
    uint256 public userFollowersCount = 0;
    mapping(uint256 => UserFollower) public userFollowers;

    function createArticle(
        string memory _title,
        string memory _slug,
        string memory _description,
        string memory _body,
        uint256[] memory _tagIds
    ) public {
        require(articleSlugs[_slug] == 0, "Article with slug already exists");
        articles[articlesCount] = Article(
            articlesCount,
            _title,
            _slug,
            _description,
            _body,
            msg.sender,
            block.timestamp
        );
        articleSlugs[_slug] = articlesCount;

        for (uint256 i = 0; i < _tagIds.length; i++) {
            articleTags[_tagIds[i]] = ArticleTag(articlesCount - 1, _tagIds[i]);
            articleTagsCount++;
        }
        articlesCount++;
    }

    function getArticlesCount() public view returns (uint256) {
        return articlesCount;
    }

    function getArticle(uint256 _articleId)
        public
        view
        returns (ArticleResource memory)
    {
        require(_articleId < articlesCount, "Article does not exist");
        string[] memory _tags = new string[](articleTagsCount);
        uint256 j = 0;
        for (uint256 i = 0; i < articleTagsCount; i++) {
            if (articleTags[i].articleId == _articleId) {
                _tags[j] = tags[articleTags[i].tagId];
                j++;
            }
        }

        address[] memory _favoritedByUsers = new address[](
            articleFavoritesCount
        );
        uint256 k = 0;
        for (uint256 l = 0; l < articleFavoritesCount; l++) {
            if (
                articleFavorites[l].articleId == _articleId &&
                articleFavorites[l].unfavoritedAt == 0
            ) {
                _favoritedByUsers[k] = articleFavorites[l].user;
                k++;
            }
        }

        Comment[] memory _comments = new Comment[](commentsCount);
        uint256 m = 0;
        for (uint256 n = 0; n < commentsCount; n++) {
            if (comments[n].articleId == _articleId) {
                _comments[m] = comments[n];
                m++;
            }
        }

        return
            ArticleResource(
                articles[_articleId],
                _tags,
                _favoritedByUsers,
                getUser(articles[_articleId].user, false, false),
                _comments
            );
    }

    function getArticleBySlug(string memory _slug)
        public
        view
        returns (ArticleResource memory)
    {
        if (
            articleSlugs[_slug] == 0 &&
            articles[articleSlugs[_slug]].createdAt == 0
        ) {
            revert("Article with slug does not exist");
        }
        return getArticle(articleSlugs[_slug]);
    }

    function getTags() public view returns (string[] memory) {
        return tags;
    }

    function getArticles() public view returns (ArticleResource[] memory) {
        ArticleResource[] memory result = new ArticleResource[](articlesCount);
        for (uint256 i = 0; i < articlesCount; i++) {
            result[i] = getArticle(i);
        }
        return result;
    }

    function getUsersWhoFavoritedArticle(uint256 _articleId)
        public
        view
        returns (address[] memory)
    {
        require(_articleId < articlesCount, "Article does not exist");
        address[] memory result = new address[](articleFavoritesCount);
        uint256 j = 0;
        for (uint256 i = 0; i < articleFavoritesCount; i++) {
            if (
                articleFavorites[i].articleId == _articleId &&
                articleFavorites[i].unfavoritedAt == 0
            ) {
                result[j] = articleFavorites[i].user;
                j++;
            }
        }
        return result;
    }

    function getArticlesFavoritedByUser(address _user)
        public
        view
        returns (ArticleResource[] memory)
    {
        ArticleResource[] memory result = new ArticleResource[](
            articleFavoritesCount
        );
        uint256 j = 0;
        for (uint256 i = 0; i < articleFavoritesCount; i++) {
            if (
                articleFavorites[i].user == _user &&
                articleFavorites[i].unfavoritedAt == 0
            ) {
                result[j] = getArticle(articleFavorites[i].articleId);
                j++;
            }
        }
        return result;
    }

    function createArticleFavorite(uint256 _articleId) public {
        require(_articleId < articlesCount, "Article does not exist");
        require(
            articles[_articleId].user != msg.sender,
            "Cannot favorite your own article"
        );

        for (uint256 i = 0; i < articleFavoritesCount; i++) {
            if (
                articleFavorites[i].articleId == _articleId &&
                articleFavorites[i].user == msg.sender &&
                articleFavorites[i].unfavoritedAt == 0
            ) {
                revert("Already favorited this article");
            }
        }

        articleFavorites[articleFavoritesCount] = ArticleFavorite(
            _articleId,
            msg.sender,
            0
        );
        articleFavoritesCount++;
    }

    function deleteArticleFavorite(uint256 _articleId) public {
        require(_articleId < articlesCount, "Article does not exist");
        require(
            articles[_articleId].user != msg.sender,
            "You cannot unfavorite your own article"
        );
        for (uint256 i = 0; i < articleFavoritesCount; i++) {
            if (
                articleFavorites[i].articleId == _articleId &&
                articleFavorites[i].user == msg.sender &&
                articleFavorites[i].unfavoritedAt == 0
            ) {
                articleFavorites[i].unfavoritedAt = block.timestamp;
                return;
            }
        }

        revert("You have not favorited this article");
    }

    function updateUser(
        string memory _name,
        string memory _bio,
        string memory _image
    ) public {
        users[msg.sender] = User(msg.sender, _name, _bio, _image);
    }

    function getUser(
        address _user,
        bool _withFollowedBy,
        bool _withFollowings
    ) public view returns (UserResource memory) {
        User[] memory followedBy = new User[](userFollowersCount);
        if (_withFollowedBy) {
            for (uint256 i = 0; i < userFollowersCount; i++) {
                if (userFollowers[i].user == _user) {
                    followedBy[i] = users[userFollowers[i].followedBy];
                }
            }
        }

        User[] memory followings = new User[](userFollowersCount);
        if (_withFollowings) {
            for (uint256 i = 0; i < userFollowersCount; i++) {
                if (userFollowers[i].followedBy == _user) {
                    followings[i] = users[userFollowers[i].user];
                }
            }
        }

        if (
            keccak256(abi.encodePacked(users[_user].name)) ==
            keccak256(abi.encodePacked(""))
        ) {
            return
                UserResource(
                    User(msg.sender, "", "", ""),
                    followings,
                    followedBy
                );
        }

        return UserResource(users[_user], followings, followedBy);
    }

    function followUser(address _user) public {
        require(_user != msg.sender, "Cannot follow yourself");
        for (uint256 i = 0; i < userFollowersCount; i++) {
            if (
                userFollowers[i].user == msg.sender &&
                userFollowers[i].followedBy == _user &&
                userFollowers[i].unfollowedAt == 0
            ) {
                revert("Already following this user");
            }
        }

        userFollowers[userFollowersCount] = UserFollower(msg.sender, _user, 0);
        userFollowersCount++;
    }

    function unfollowUser(address _user) public {
        require(_user != msg.sender, "Cannot unfollow yourself");
        for (uint256 i = 0; i < userFollowersCount; i++) {
            if (
                userFollowers[i].user == msg.sender &&
                userFollowers[i].followedBy == _user &&
                userFollowers[i].unfollowedAt == 0
            ) {
                userFollowers[i].unfollowedAt = block.timestamp;
                return;
            }
        }
    }

    function createTag(string memory _tag) public {
        require(
            keccak256(abi.encodePacked(_tag)) !=
                keccak256(abi.encodePacked("")),
            "Tag cannot be empty"
        );
        for (uint256 i = 0; i < tags.length; i++) {
            if (
                keccak256(abi.encodePacked(tags[i])) ==
                keccak256(abi.encodePacked(_tag))
            ) {
                revert("Tag already exists");
            }
        }
        tags.push(_tag);
    }

    function createComment(uint256 _articleId, string memory _body) public {
        require(_articleId < articlesCount, "Article does not exist");
        require(
            keccak256(abi.encodePacked(_body)) !=
                keccak256(abi.encodePacked("")),
            "Comment cannot be empty"
        );

        comments[commentsCount] = Comment(
            commentsCount,
            _articleId,
            _body,
            msg.sender,
            block.timestamp,
            0
        );
        commentsCount++;
    }
}
