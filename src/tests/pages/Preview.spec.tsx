import { mocked } from "ts-jest/utils"
import { render, screen } from "@testing-library/react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/client"

import Post, { getStaticProps } from "../../pages/posts/preview/[slug]"
import { getPrismicClient } from "../../services/prismic"

const post = {
  slug: "my-post",
  title: "My post",
  content: "<p>Post excerpt</p>",
  updatedAt: "2 de Outubro"
}

jest.mock("next-auth/client")
jest.mock("next/router")
jest.mock("../../services/prismic")

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([null, false])

    render(
      <Post post={ post } />
    )

    expect(screen.getByText("My post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument()
  })

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = mocked(useSession)
    useSessionMocked.mockReturnValueOnce([{
      activeSubscription: "fake-active-subscription"
    }, false] as any)

    const pushMock = jest.fn()
    const useRouterMocked = mocked(useRouter)
    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(
      <Post post={ post } />
    )

    expect(pushMock).toHaveBeenCalledWith("/posts/my-post")
  })

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [
            { type: "heading", text: "My post" }
          ],
          content: [
            { type: "paragraph", text: "Post content" }
          ]
        },
        last_publication_date: "10-03-2021"
      })
    } as any)

    const response = await getStaticProps({
      params: { slug: "my-post" }
    })

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-post",
            title: "My post",
            content: "<p>Post content</p>",
            updatedAt: "03 de outubro de 2021"
          }
        }
      })
    )
  })
})