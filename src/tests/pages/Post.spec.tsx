import { getSession } from "next-auth/client"
import { mocked } from "ts-jest/utils"
import { render, screen } from "@testing-library/react"

import Post, { getServerSideProps } from "../../pages/posts/[slug]"
import { getPrismicClient } from "../../services/prismic"

const post = {
  slug: "my-post",
  title: "My post",
  content: "<p>Post excerpt</p>",
  updatedAt: "2 de Outubro"
}

jest.mock("next-auth/client")
jest.mock("../../services/prismic")

describe("Posts page", () => {
  it("renders correctly", () => {
    render(
      <Post post={ post } />
    )

    expect(screen.getByText("My post")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
  })

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: "my-post" }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/"
        })
      })
    )
  })

  it("loads initial data", async () => {
    const getSessionMocked = mocked(getSession)
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription"
    } as any)

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

    const response = await getServerSideProps({
      params: { slug: "my-post" }
    } as any)

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