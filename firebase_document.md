📦 Firestore Database
│
├── 📁 users (collection)
│   └── 📄 {userId} (document)
│       ├── fullName
│       ├── headline
│       ├── about
│       ├── profilePictureUrl
│       ├── coverImageUrl
│       ├── location
│       ├── email
│       ├── websiteUrl
│       ├── industry
│       ├── currentRole
│
│       ├── 📁 experience (sub-collection)
│       │   └── 📄 {experienceId}
│       │       ├── jobTitle
│       │       ├── companyName
│       │       ├── location
│       │       ├── employmentType
│       │       ├── startDate
│       │       ├── endDate
│       │       ├── isCurrent
│       │       ├── description
│       │       ├── skillsUsed [array]
│
│       ├── 📁 education (sub-collection)
│       │   └── 📄 {educationId}
│       │       ├── schoolName
│       │       ├── degree
│       │       ├── fieldOfStudy
│       │       ├── startDate
│       │       ├── endDate
│       │       ├── grade
│       │       ├── description
│
│       ├── 📁 skills (sub-collection)
│       │   └── 📄 {skillId}
│       │       ├── skillName
│       │       ├── category
│       │       ├── level
│       │       ├── endorsementsCount
│
│       ├── 📁 projects (sub-collection)
│       │   └── 📄 {projectId}
│       │       ├── title
│       │       ├── description
│       │       ├── techStack [array]
│       │       ├── liveDemoUrl
│       │       ├── githubUrl
│       │       ├── images [array]
│       │       ├── featured
│       │       ├── startDate
│       │       ├── endDate
│       │       ├── status
│
│       ├── 📁 certifications (sub-collection)
│       │   └── 📄 {certId}
│       │       ├── title
│       │       ├── issuer
│       │       ├── issueDate
│       │       ├── expiryDate
│       │       ├── credentialId
│       │       ├── url
│
│       ├── 📁 connections (sub-collection)
│       │   └── 📄 {connectionId}
│       │       ├── name
│       │       ├── profilePicture
│       │       ├── role
│       │       ├── connectedSince
│
│       ├── 📁 posts (sub-collection)
│       │   └── 📄 {postId}
│       │       ├── content
│       │       ├── mediaUrls [array]
│       │       ├── createdAt
│       │       ├── likesCount
│       │       ├── commentsCount
│
│
├── 📁 contact_messages (collection)
│   └── 📄 {messageId}
│       ├── name
│       ├── email
│       ├── subject
│       ├── message
│       ├── createdAt
│       ├── isRead
│
│
├── 📁 portfolio_settings (collection)
│   └── 📄 {userId}
│       ├── theme
│       ├── homeTitle
│       ├── homeSubtitle
│       ├── aboutText
│       ├── featuredProjectIds [array]
│       ├── socialLinks
│       │   ├── github
│       │   ├── linkedin
│       │   ├── twitter
│       │   ├── email
│       ├── resumeUrl
│
│
├── 📁 admins (collection)
│   └── 📄 {adminId}
│       ├── username
│       ├── passwordHash
│       ├── role
│       ├── lastLogin