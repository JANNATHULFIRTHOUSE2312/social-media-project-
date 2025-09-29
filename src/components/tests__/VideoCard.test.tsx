import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import VideoCard from "@/components/VideoCard";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import api from "@/lib/axios";
import { toast } from "sonner"; // ✅ import directly

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/context/CartContext", () => ({
  useCart: jest.fn(),
}));

jest.mock("@/lib/axios", () => ({
  post: jest.fn(),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

const mockVideo = {
  _id: "123",
  title: "Test Video",
  thumbnailUrl: "https://example.com/thumb.jpg",
  previewUrl: "https://example.com/preview.mp4",
  views: 1500,
};

describe("VideoCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders video title and views", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: { id: "1" } });
    (useCart as jest.Mock).mockReturnValue({ fetchCart: jest.fn() });

    render(<VideoCard video={mockVideo} />);

    expect(screen.getByText("Test Video")).toBeInTheDocument();
    expect(screen.getByText("2K views")).toBeInTheDocument(); // 1500 → "2K"
  });

  it("shows error toast if user not logged in and add to cart clicked", () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    (useCart as jest.Mock).mockReturnValue({ fetchCart: jest.fn() });

    render(<VideoCard video={mockVideo} />);

    const cartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(cartButton);

    expect(toast.error).toHaveBeenCalledWith(
      "Please log in to add items to your cart."
    );
  });

  it("adds video to cart when user is logged in", async () => {
    const fetchCart = jest.fn();

    (useAuth as jest.Mock).mockReturnValue({ user: { id: "1" } });
    (useCart as jest.Mock).mockReturnValue({ fetchCart });
    (api.post as jest.Mock).mockResolvedValue({});

    render(<VideoCard video={mockVideo} />);

    const cartButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(cartButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/cart/add", {
        videoId: "123",
        purchaseType: "buy",
      });

      expect(toast.success).toHaveBeenCalledWith(
        `"${mockVideo.title}" added to your cart!`
      );

      expect(fetchCart).toHaveBeenCalled();
    });
  });
});
