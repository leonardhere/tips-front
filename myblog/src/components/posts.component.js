import { Component } from '../core/component'
import { apiService } from '../services/api.services'
import { TransformService } from '../services/transform.service'

export class PostsComponent extends Component {
  constructor(id) {
    super(id)
  }

  async onShow() {
    const fbData =  await apiService.fetchPost()
    const posts = TransformService.fbObjectToArray(fbData)
    const html = posts.map(post => renderPost(post))

    this.$el.insertAdjacentHTML('afterbegin', html.join(' '))
  }
}

function renderPost(post) {
  return `
        <div class="panel">
          <div class="panel-head">
              <p class="panel-title">${post.title}</p>
              <ul class="tags">
                <li class="tag tag-blue tag-rounded">${post.type}</li>
              </ul>
          </div>
              <div class="panel-body">
                <p class="multi-line">${post.fullname}</p>
              </div>
              <div class="panel-footer w-panel-footer">
                <small>${post.date}</small>
              </div>
        </div>
  `
}
