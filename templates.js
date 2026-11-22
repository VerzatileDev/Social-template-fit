/* =====================================================================
   TEMPLATES: the only file you need to edit to change platforms/templates.

   Each template is one object:
     name   Label shown in the picker (must be unique within its platform)
     w, h   Size in pixels
     gif    GifS  = animated GIF works
            GifMS = maybe / unreliable
            GifNS = still image only            (default)
     vid    VidS  = MP4 works
            VidMS = maybe
            VidNS = no MP4                      (default)
     hint   Optional note about video specs, shown under the preview
     zones  Optional overlay areas the platform covers, as fractions of the image:
            { label, x, y, w, h }

   Each platform can also have:
     maxMB  Upload size limit; exports are auto-reduced to fit it
   ===================================================================== */

// Template selected on first load (falls back to the first template if not found)
const DEFAULT_TEMPLATE = ["Facebook", "Event cover photo 1.91:1"];

const PLATFORMS = {
  Facebook: {
    templates: [
      { name: "Page cover photo 2.62:1", w: 1640, h: 642 },
      { name: "Event cover photo 1.91:1", w: 1920, h: 1005 },
      { name: "Profile image 1:1", w: 1200, h: 1200 },
      {
        name: "Square post 1:1",
        w: 1440,
        h: 1440,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      {
        name: "Portrait post 4:5",
        w: 1440,
        h: 1800,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      {
        name: "Landscape post 16:9",
        w: 1092,
        h: 1080,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4 (H.264). Square or vertical fits feeds best.",
      },
      { name: "Shared Link preview 1.91:1", w: 1200, h: 630 },
      {
        name: "Story / Reel 9:16",
        w: 1440,
        h: 2560,
        vid: "VidS",
        hint: "MP4, 1080×1920, 1–60 s per story.",
      },
    ],
  },

  Instagram: {
    templates: [
      {
        name: "Square post 1:1",
        w: 1080,
        h: 1080,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Portrait post 4:5",
        w: 1080,
        h: 1350,
        vid: "VidS",
        hint: "MP4 or MOV, 1080 px wide.",
      },
      {
        name: "Story / Reel 9:16",
        w: 1080,
        h: 1920,
        vid: "VidS",
        hint: "MP4 or MOV, 1080×1920, stories up to 60 s.",
      },
    ],
  },

  "X / Twitter": {
    templates: [
      { name: "Header", w: 1500, h: 500 },
      {
        name: "Post image",
        w: 1600,
        h: 900,
        gif: "GifS",
        vid: "VidS",
        hint: "MP4, up to about 140 s and 512 MB.",
      },
    ],
  },

  LinkedIn: {
    templates: [
      { name: "Page banner", w: 1584, h: 396 },
      {
        name: "Post",
        w: 1200,
        h: 627,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4, 3 s to 30 min, up to 5 GB.",
      },
    ],
  },

  YouTube: {
    templates: [
      { name: "Thumbnail", w: 1280, h: 720 },
      { name: "Channel banner", w: 2560, h: 1440 },
    ],
  },

  Bluesky: {
    templates: [
      { name: "Profile picture", w: 1000, h: 1000, gif: "GifNS" },
      { name: "Banner", w: 3000, h: 1000 },
      {
        name: "Post image",
        w: 1200,
        h: 675,
        gif: "GifMS",
        vid: "VidS",
        hint: "MP4, up to about 3 min and 100 MB.",
      },
    ],
  },

  ArtStation: {
    templates: [
      { name: "Profile banner", w: 1920, h: 400 },
      { name: "Project thumbnail", w: 1920, h: 1080 },
      { name: "Avatar", w: 400, h: 400 },
    ],
  },

  "Ko-fi": {
    templates: [
      { name: "Page banner", w: 1500, h: 500 },
      { name: "Avatar", w: 512, h: 512 },
    ],
  },

  Reddit: {
    templates: [
      { name: "Community banner", w: 1920, h: 384 },
      { name: "Community icon", w: 256, h: 256 },
    ],
  },

  Mastodon: {
    templates: [
      { name: "Profile picture", w: 400, h: 400, gif: "GifMS" },
      { name: "Header", w: 1500, h: 500, gif: "GifMS" },
      { name: "Link preview", w: 1200, h: 630 },
    ],
  },

  "itch.io": {
    maxMB: 3,
    templates: [
      {
        name: "Cover image",
        w: 630,
        h: 500,
        gif: "GifS",
        zones: [{ label: "GIF label", x: 0.01, y: 0.02, w: 0.14, h: 0.11 }],
      },
      { name: "Header image", w: 960, h: 400, gif: "GifMS" },
      { name: "Screenshot 16:9", w: 1920, h: 1080, gif: "GifS" },
      { name: "Screenshot 4:3", w: 1200, h: 900, gif: "GifS" },
      { name: "Screenshot 3:4 (portrait)", w: 900, h: 1200, gif: "GifS" },
      { name: "Screenshot 1:1", w: 800, h: 800, gif: "GifS" },
      { name: "Page banner", w: 2048, h: 880, gif: "GifS" },
      { name: "Metadata Wide cover (21:9)", w: 2100, h: 900 },
      {
        name: "Metadata Social media image",
        w: 1200,
        h: 630,
        gif: "GifMS",
        zones: [
          { label: "May crop", x: 0, y: 0, w: 0.2417, h: 1 },
          { label: "May crop", x: 0.7583, y: 0, w: 0.2417, h: 1 },
        ],
      },
      { name: "Profile /Metadata favicon", w: 500, h: 500 },
    ],
  },

  "Unity Asset Store": {
    templates: [
      { name: "Icon", w: 160, h: 160 },
      { name: "Card", w: 420, h: 280 },
      { name: "Cover", w: 1950, h: 1300 },
      { name: "Social media", w: 1200, h: 630 },
    ],
  },

  "Epic / Fab": {
    templates: [
      {
        name: "Gallery image",
        w: 1920,
        h: 1080,
        vid: "VidS",
        hint: "Fab gallery video: 1920×1080 MP4, up to 300 MB.",
      },
    ],
  },
};
