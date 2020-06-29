import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StyleSheet, Text, View, FlatList } from 'react-native'

import axios from '../utils/fetcher'
import { AuthContext } from '../context/auth-context'

import Post from '../components/post'
import CommentListItem from '../components/comment-list-item'
import CreateComment from '../components/create-comment'

const PostDetail = ({ route }) => {
  const { authState } = React.useContext(AuthContext)
  const flatListRef = React.useRef()

  const [post, setPost] = React.useState(null)
  const [isLoading, setIsLoaading] = React.useState(false)
  const [comment, setComment] = React.useState('')
  const [isFocused, setIsFocused] = React.useState(null)

  const { postId } = route.params

  const getPostData = async () => {
    setIsLoaading(true)
    const { data } = await axios.get(`post/${postId}`)
    setPost(data)
    setIsLoaading(false)
  }

  React.useEffect(() => {
    getPostData()
  }, [])

  React.useEffect(() => {
    isFocused &&
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
  }, [isFocused])

  const createComment = async () => {
    const { data } = await axios.post(`/post/${postId}`, {
      comment
    })
    setPost(data)
    setComment('')
  }

  return (
    <View as={SafeAreaView} style={styles.container}>
      {post ? (
        <>
          <FlatList
            ref={flatListRef}
            data={post.comments.sort((a, b) => a.created < b.created)}
            refreshing={isLoading}
            onRefresh={() => getPostData()}
            keyExtractor={item => item.id}
            ListHeaderComponent={
              <Post
                index={false}
                postId={post.id}
                userId={authState.userInfo.id}
                score={post.score}
                type={post.type}
                title={post.title}
                author={post.author}
                category={post.category}
                text={post.text}
                comments={post.comments}
                created={post.created}
                url={post.url}
                votes={post.votes}
                views={post.views}
                setIsLoaading={setIsLoaading}
                setData={setPost}
              />
            }
            renderItem={({ item, index }) => (
              <CommentListItem
                body={item.body}
                author={item.author}
                created={item.created}
              />
            )}
          />
          <CreateComment
            onPress={createComment}
            setComment={setComment}
            setIsFocused={setIsFocused}
            comment={comment}
          />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})

export default PostDetail
