package ax.f4j.util;

import java.util.ArrayList;
import java.util.List;

public class FileUtil {

	public static List<String> videoFile = new ArrayList<String>();
	public static List<String> docFile = new ArrayList<String>();


	static {
		videoFile.add("mp4");
		docFile.add("pdf");
	}



	public synchronized static String getFileName() {
		return String.valueOf(System.nanoTime());
	}


	public static String getSuffix(String filename) {
		if (filename.lastIndexOf(".") >= 0) {
			return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
		} else {
			return "";
		}
	}




	
}
