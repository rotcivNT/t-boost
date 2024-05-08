import AddBookmarkMenu from "./AddBookmarkMenu";
import BookmarkList from "./BookmarkList";

function BookmarkWrapper() {
  return (
    <div className="flex justify-between items-center flex-1">
      <BookmarkList />
      <AddBookmarkMenu />
    </div>
  );
}

export default BookmarkWrapper;
