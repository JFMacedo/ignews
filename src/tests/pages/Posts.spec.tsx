import { mocked } from "ts-jest/utils"
import { render, screen } from "@testing-library/react"

import Posts, { getStaticProps } from "../../pages/posts"
import { getPrismicClient } from "../../services/prismic"

const posts = [{
  slug: "my-post",
  title: "My post",
  excerpt: "Post excerpt",
  updatedAt: "2 de Outubro"
}]

jest.mock("../../services/prismic")

describe("Posts page", () => {
  it("renders correctly", () => {
    render(
      <Posts posts={ posts } />
    )

    expect(screen.getByText("My post")).toBeInTheDocument()
  })

  it("loads initial data", async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)
    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-post",
            data: {
              title: [
                { type: "heading", text: "My post" }
              ],
              content: [
                { type: "paragraph", text: "Post excerpt" }
              ]
            },
            last_publication_date: "10-02-2021"
          }
        ]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: "my-post",
            title: "My post",
            excerpt: "Post excerpt",
            updatedAt: "02 de outubro de 2021"
          }]
        }
      })
    )
  })
})