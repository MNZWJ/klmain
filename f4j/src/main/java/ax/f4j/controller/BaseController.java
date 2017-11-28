package ax.f4j.controller;



import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.util.StringUtils;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;


/**
 * 
 * 
 * <p>Title:</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2016</p>
 * <p>Company:第十三工房</p>
 * 
 * @author 罗成
 * @version 0.1.0 创建时间：2016年8月10日-上午10:11:48
 */
public class BaseController  {

	private static final Logger logger = LoggerFactory.getLogger(BaseController.class);

	protected ModelAndView mv = this.getModelAndView();

	public ModelAndView getModelAndView(){
		
		return new ModelAndView();
	}

	public HttpServletRequest getRequest() {
		HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
		return request;
	}

	public HttpServletResponse getResponse() {
		return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
	}

	public String getHeader(String headerName){
		HttpServletRequest request = getRequest();
		return request.getHeader(headerName);
	}

	/**
	 * 获得远端IP地址，考虑到Nginx反向代理的情况
	 * @return
	 */
	public String getRemoteAddress(){
		HttpServletRequest request = getRequest();
		String rd = null;
		//如果经过了Nginx代理，则从请求头中获取远端地址
		String xf = getHeader("x-forwarded-for");
		String xrip = getHeader("X-Real-IP");
		if(!StringUtils.isEmpty(xf)){
			rd = xf.split(",")[0].trim();
		}else if(!StringUtils.isEmpty(xrip)){
			rd = xrip;
		}
		return rd == null ? request.getRemoteAddr() : rd;
	}

	public HttpSession getSession() {
		return getRequest().getSession();
	}
}
