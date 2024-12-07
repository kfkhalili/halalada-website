import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import dayjs from "dayjs";

type Status = "idle" | "loading" | "loaded" | "error";
type Post = {
  link: string;
  title: string;
  thumbnail: string;
  date: string;
};

const mediumFetch = async () => {
  const res = await fetch(`/api/medium-posts`);
  return await res.json();
};

export const Resources: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    setStatus("loading");
    mediumFetch()
      .then((res) => {
        if (res.status === "error") {
          setStatus("error");
          return;
        }

        setPosts(res || []);
        setStatus("loaded");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  return (
    <section id="resources" className="resources py-36 mx-auto">
      <div className="container mx-auto pl-6 sm:pl-0 pr-6 sm:pr-0">
        <h2 className="section-heading mb-16" data-aos="fade-down">
          Resources
        </h2>

        <div>
          {status === "loading" && <p className="text-white">Loading...</p>}
          {status === "error" && (
            <div className="text-white">
              <p className="mb-3">
                Sorry, we cannot load preview of our resources at the moment.
              </p>
              <p>
                But you can always directly check out{" "}
                <a
                  href="https://medium.com/@HalalADAPool"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  our blog
                </a>
              </p>
            </div>
          )}
          {status === "loaded" && (
            <>
              <Swiper
                pagination={{
                  dynamicBullets: true,
                  clickable: true,
                }}
                spaceBetween={20}
                slidesPerView={3}
                breakpoints={{
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 20,
                  },
                  500: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                  },
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                }}
              >
                {posts.map((post, index) => (
                  <SwiperSlide key={index}>
                    <PostCard post={post} />
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="mt-8">
                <a
                  href="https://medium.com/@HalalADAPool"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  See More Articles
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <div className="bg-card p-8 rounded-md post-card mb-10 h-full">
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-4 flex-1 flex flex-col"
      >
        <img
          src={post.thumbnail}
          className="h-52 object-cover w-full mb-6"
          alt="post cover"
        />

        <h3 className="text-white text-lg line-clamp-2">{post.title}</h3>
      </a>
      <div className="text-sm text-white">
        {dayjs(post.date).format("MMM DD, YYYY")}
      </div>
    </div>
  );
};

export default Resources;
