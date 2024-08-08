import { Image } from '@chakra-ui/react';

function BookmarkAdded({ message, status }) {
  return (
    <div
      className={'bg-black text-grey flex flex-col justify-center items-center'}
    >
      <p className="text-lg mb-4 text-center">{status}</p>
      <Image
        src={status === 'success' ? '/success.webp' : '/fail.webp'}
        alt="failed popup"
        className=""
      />

      <h3 className="text-2xl mt-4 text-cente">{message}</h3>
    </div>
  );
}

export default BookmarkAdded;
