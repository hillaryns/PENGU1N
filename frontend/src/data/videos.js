/** Educational YouTube videos — videoId from official/tutorial channels */
export const VIDEO_CATEGORIES = [
  'all', 'html', 'css', 'javascript', 'react', 'nodejs', 'python', 'ai-ml', 'linux', 'cybersecurity', 'git', 'devops',
];

export const videos = [
  { id: 'v1', category: 'html', title: 'HTML Crash Course For Absolute Beginners', duration: '1:05:00', level: 'Beginner', videoId: 'UB1O30fR-EE', instructor: 'Traversy Media', rating: 4.8, tags: ['HTML', 'Basics'] },
  { id: 'v2', category: 'html', title: 'HTML Full Course for Beginners', duration: '2:02:00', level: 'Beginner', videoId: 'pQN-pnXPaVg', instructor: 'freeCodeCamp', rating: 4.9, tags: ['HTML', 'Semantic'] },
  { id: 'v3', category: 'html', title: 'Learn HTML in 1 Hour', duration: '1:00:00', level: 'Beginner', videoId: 'F-qQvHiN5Jo', instructor: 'Programming with Mosh', rating: 4.7, tags: ['HTML', 'Quick Start'] },
  { id: 'v4', category: 'css', title: 'CSS Crash Course', duration: '1:25:00', level: 'Beginner', videoId: 'yfoY53QXEnI', instructor: 'Traversy Media', rating: 4.8, tags: ['CSS'] },
  { id: 'v5', category: 'css', title: 'CSS Full Course - Includes Flexbox & Grid', duration: '6:18:00', level: 'Beginner', videoId: 'OXGznpKZ_sA', instructor: 'freeCodeCamp', rating: 4.9, tags: ['CSS', 'Flexbox', 'Grid'] },
  { id: 'v6', category: 'css', title: 'Flexbox in 20 Minutes', duration: '0:20:00', level: 'Intermediate', videoId: 'JJSoEo8JSnc', instructor: 'Traversy Media', rating: 4.8, tags: ['Flexbox'] },
  { id: 'v7', category: 'javascript', title: 'JavaScript Tutorial for Beginners', duration: '3:26:00', level: 'Beginner', videoId: 'PkZNo7MFNFg', instructor: 'Programming with Mosh', rating: 4.9, tags: ['JavaScript'] },
  { id: 'v8', category: 'javascript', title: 'JavaScript Full Course for Beginners', duration: '3:26:00', level: 'Beginner', videoId: 'W6NZfCO5SIk', instructor: 'Programming with Mosh', rating: 4.9, tags: ['JS', 'Fundamentals'] },
  { id: 'v9', category: 'javascript', title: 'Modern JavaScript From The Beginning', duration: '1:30:00', level: 'Intermediate', videoId: 'NCwa_xi0Uuc', instructor: 'Traversy Media', rating: 4.7, tags: ['ES6'] },
  { id: 'v10', category: 'react', title: 'React JS Crash Course', duration: '1:48:00', level: 'Intermediate', videoId: 'w7ejDZ8SWv8', instructor: 'Traversy Media', rating: 4.8, tags: ['React'] },
  { id: 'v11', category: 'react', title: 'React Course - Beginners Tutorial', duration: '5:00:00', level: 'Intermediate', videoId: 'bMknfYXAoc0', instructor: 'freeCodeCamp', rating: 4.9, tags: ['React', 'Hooks'] },
  { id: 'v12', category: 'nodejs', title: 'Node.js Crash Course', duration: '1:30:00', level: 'Intermediate', videoId: 'fBNz5xF-Kx4', instructor: 'Traversy Media', rating: 4.8, tags: ['Node.js'] },
  { id: 'v13', category: 'nodejs', title: 'Node.js Tutorial for Beginners', duration: '2:30:00', level: 'Intermediate', videoId: 'TlB_eWDSMt4', instructor: 'Programming with Mosh', rating: 4.8, tags: ['Node', 'API'] },
  { id: 'v14', category: 'python', title: 'Python for Beginners - Full Course', duration: '4:26:00', level: 'Beginner', videoId: 'rfscVS0vtbw', instructor: 'freeCodeCamp', rating: 4.9, tags: ['Python'] },
  { id: 'v15', category: 'python', title: 'Python Tutorial - Python for Beginners', duration: '6:14:00', level: 'Beginner', videoId: '_uQrJ0TkZlc', instructor: 'Programming with Mosh', rating: 4.9, tags: ['Python', 'OOP'] },
  { id: 'v16', category: 'ai-ml', title: 'Machine Learning for Everybody', duration: '3:25:00', level: 'Beginner', videoId: 'i_LwzRVP7bg', instructor: 'freeCodeCamp', rating: 4.7, tags: ['ML', 'AI'] },
  { id: 'v17', category: 'ai-ml', title: 'Deep Learning Crash Course', duration: '1:30:00', level: 'Advanced', videoId: 'VyWAvY2CF9c', instructor: 'freeCodeCamp', rating: 4.6, tags: ['Deep Learning'] },
  { id: 'v18', category: 'linux', title: 'Linux for Ethical Hackers', duration: '1:00:00', level: 'Beginner', videoId: '1A2S3D4F5G6', instructor: 'NetworkChuck', rating: 4.7, tags: ['Linux'] },
  { id: 'v19', category: 'linux', title: 'The 50 Most Popular Linux Commands', duration: '0:22:00', level: 'Beginner', videoId: 'ZtqBQ68cfJc', instructor: 'freeCodeCamp', rating: 4.8, tags: ['CLI', 'Linux'] },
  { id: 'v20', category: 'cybersecurity', title: 'Cybersecurity Full Course', duration: '12:00:00', level: 'Intermediate', videoId: 'inWWhr5tnEA', instructor: 'IBM / freeCodeCamp', rating: 4.7, tags: ['Security'] },
  { id: 'v21', category: 'git', title: 'Git and GitHub for Beginners', duration: '1:12:00', level: 'Beginner', videoId: 'RGOj5yL3iqk', instructor: 'freeCodeCamp', rating: 4.9, tags: ['Git', 'GitHub'] },
  { id: 'v22', category: 'git', title: 'Git Tutorial for Beginners', duration: '1:09:00', level: 'Beginner', videoId: '8JJ101D3knE', instructor: 'Programming with Mosh', rating: 4.8, tags: ['Git'] },
  { id: 'v23', category: 'devops', title: 'Docker Tutorial for Beginners', duration: '3:00:00', level: 'Intermediate', videoId: 'pTFZFmg4bEY', instructor: 'freeCodeCamp', rating: 4.8, tags: ['Docker', 'DevOps'] },
  { id: 'v24', category: 'devops', title: 'Kubernetes Course for Beginners', duration: '4:00:00', level: 'Advanced', videoId: 'X48VuqFV5WI', instructor: 'freeCodeCamp', rating: 4.7, tags: ['K8s'] },
  { id: 'v25', category: 'javascript', title: 'Async JavaScript Crash Course', duration: '0:40:00', level: 'Intermediate', videoId: 'PoRJizFvM7s', instructor: 'Traversy Media', rating: 4.8, tags: ['Async', 'Promises'] },
  { id: 'v26', category: 'react', title: 'React Hooks Course', duration: '1:40:00', level: 'Intermediate', videoId: 'LlvBzyJbjIg', instructor: 'freeCodeCamp', rating: 4.8, tags: ['Hooks'] },
];

export function getYouTubeThumb(videoId, quality = 'hqdefault') {
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
}

export function getVideoById(id) {
  return videos.find((v) => v.id === id);
}
