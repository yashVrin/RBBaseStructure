export interface PostModel {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// ✅ Example PostModel object (used for default/reference)
const defaultPostModel: PostModel = {
  userId: 0,
  id: 0,
  title: '',
  body: '',
};

export default defaultPostModel;
