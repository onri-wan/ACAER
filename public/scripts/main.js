const caption = document.getElementsByClassName('caption')
const captionButton = document.getElementById('read-more-less')

// if the scrollHeight is larger than the offsetHeight, 
// then the caption is truncated
const showReadMore = () => {
    captionButton.innerHTML = 'Read More'
    captionButton.classList.add('show-read-less')
    return 'add'
}

const showReadLess = () => {
    captionButton.innerHTML = 'Read Less'
    if (captionButton.classList.contains('show-read-less')) {
        captionButton.style.display = 'block'
    }
    return 'remove'
}

const observer = new ResizeObserver(entries => {
    for (const entry of entries) {
        entry.target.classList[entry.target.scrollHeight > entry.contentRect.height
        ? showReadMore()
        : showReadLess()]('truncated')
    }
})

for (const element of caption) {
    observer.observe(element)
}