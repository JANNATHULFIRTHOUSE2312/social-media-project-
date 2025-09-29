// src/components/tests__/VideoGrid.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import VideoGrid, { Video } from "@/components/VideoGrid";
import api from "@/lib/axios";
import { useInView } from "react-intersection-observer";

// ✅ Auto-mock AuthContext (prevents provider errors)
jest.mock("@/context/AuthContext", () => ({
  useAuth: () => ({ user: { id: "test-user" } }),
}));

// ✅ Mock dependencies
jest.mock("@/lib/axios", () => ({
  get: jest.fn(),
}));

jest.mock("react-intersection-observer", () => ({
  useInView: jest.fn(),
}));

jest.mock("use-debounce", () => ({
  useDebounce: (value: string) => [value], // instant, no delay
}));

const mockVideos: Video[] = [
  {
    _id: "1",
    title: "Video 1",
    thumbnailUrl: "thumb1.jpg",
    previewUrl: "preview1.mp4",
    views: 100,
  },
  {
    _id: "2",
    title: "Video 2",
    thumbnailUrl: "thumb2.jpg",
    previewUrl: "preview2.mp4",
    views: 200,
  },
];

describe("VideoGrid", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useInView as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: true });
  });

  it("renders fetched videos", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { videos: mockVideos, hasNextPage: false },
    });

    render(<VideoGrid searchTerm="" category="All" sortBy="latest" />);

    await waitFor(() => {
      expect(screen.getByText("Video 1")).toBeInTheDocument();
      expect(screen.getByText("Video 2")).toBeInTheDocument();
    });
  });

  it("shows loading text while fetching", async () => {
    let resolvePromise: (value: unknown) => void = () => {};
    (api.get as jest.Mock).mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<VideoGrid searchTerm="" category="All" sortBy="latest" />);

    expect(await screen.findByText(/loading more videos/i)).toBeInTheDocument();

    // ✅ Resolve the API request properly
    resolvePromise({ data: { videos: [], hasNextPage: false } });
  });

  it("shows 'No videos found' if API returns empty", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { videos: [], hasNextPage: false },
    });

    render(<VideoGrid searchTerm="random" category="All" sortBy="latest" />);

    expect(await screen.findByText(/No videos found/i)).toBeInTheDocument();
  });

  it("shows 'You have reached the end!' when no more pages", async () => {
    (api.get as jest.Mock).mockResolvedValueOnce({
      data: { videos: mockVideos, hasNextPage: false },
    });

    render(<VideoGrid searchTerm="" category="All" sortBy="latest" />);

    await waitFor(() => {
      expect(
        screen.getByText(/You have reached the end!/i)
      ).toBeInTheDocument();
    });
  });

  it("loads next page when inView is true and hasNextPage is true", async () => {
    (useInView as jest.Mock).mockReturnValue({ ref: jest.fn(), inView: true });

    (api.get as jest.Mock)
      .mockResolvedValueOnce({
        data: { videos: [mockVideos[0]], hasNextPage: true },
      })
      .mockResolvedValueOnce({
        data: { videos: [mockVideos[1]], hasNextPage: false },
      });

    render(<VideoGrid searchTerm="" category="All" sortBy="latest" />);

    await waitFor(() => {
      expect(screen.getByText("Video 1")).toBeInTheDocument();
      expect(screen.getByText("Video 2")).toBeInTheDocument();
    });
  });
});
